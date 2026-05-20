const Order = require("../models/order.model");
const { getIO } = require("../socket");


async function createOrder(req, res) {
  try {
    const { items, totalAmount, foodPartner, paymentMethod } = req.body;

    // ✅ 1. Validate required fields (PREVENT 500 ERRORS)
    if (!foodPartner) {
      return res.status(400).json({
        message: "Food partner is required"
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required"
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid total amount"
      });
    }

    // ✅ 2. Create order
    const order = await Order.create({
      user: req.user._id,
      foodPartner,
      items,
      totalAmount,
      paymentMethod,
       paymentStatus: paymentMethod === "cash" ? "pending" : "pending",
    });

   
    const io = getIO();
    console.log("Sending order to partner:", foodPartner);
    io.to(foodPartner.toString()).emit("newOrder", order);

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
}

async function getUserOrders(req,res){
  try{
    const userId=req.user._id;
    const orders=await Order.find({user:userId})
    .sort({createAt:-1})
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
}

module.exports = { createOrder,getUserOrders };