const Order = require("../models/order.model");
const {getIO}=require('../socket');
require("../models/food.model");

// GET all orders for logged-in food partner
async function getPartnerOrders(req, res) {
  try {
    const partner = req.foodPartner || req.partner || req.user;

    if (!partner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ foodPartner: partner._id })
      .populate("items.foodItem", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Partner orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

// UPDATE order status (only own orders)
async function updateOrderStatus(req, res) {
  try {
    const partner = req.foodPartner || req.partner || req.user;

    if (!partner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, foodPartner: partner._id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const io = getIO();
    io.to(order.user.toString()).emit("orderStatusUpdate", {
      orderId: order._id,
      status: order.status
    });

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
}

module.exports = {
  getPartnerOrders,
  updateOrderStatus
};