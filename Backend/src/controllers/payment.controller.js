const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});


// Log presence of keys (do not log secret value)
console.log("Razorpay key present:", !!process.env.RAZORPAY_KEY);

// CREATE PAYMENT ORDER
exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if the order belongs to the authenticated user
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own orders"
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: "Order is already paid"
      });
    }

    // Validate amount
    const amount = Number(order.totalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order amount" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paisa
      currency: "INR",
      receipt: orderId,
      payment_capture: 1
    });

    res.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount
    });

  } catch (error) {
    // If Razorpay returned a structured error, forward useful details
    console.error("Payment creation error:", error);
    if (error && error.statusCode) {
      const status = error.statusCode || 500;
      const body = error.error || { message: error.message };
      return res.status(status).json({ success: false, ...body });
    }
    res.status(500).json({
      success: false,
      message: "Payment order creation failed"
    });
  }
};


// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data"
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only verify payments for your own orders"
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expected === razorpay_signature) {

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "completed",
        paymentMethod: "online",
        status: "confirmed"
      });

      return res.json({
        success: true,
        message: "Payment successful"
      });

    } else {

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed"
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};