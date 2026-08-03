const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/user.model');

/* ================= FOOD PARTNER AUTH ================= */
async function authFoodPartnerMiddleware(req, res, next) {
  try {
    console.log("========== PARTNER AUTH ==========");
    console.log("Cookies:", req.cookies);
    console.log("Cookie Header:", req.headers.cookie);
    const token = req.cookies.foodPartnerToken;

    console.log("Food Partner Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.jwt_secret);

    
    const foodPartner = await foodPartnerModel.findById(decoded.id);

    if (!foodPartner) {
      return res.status(401).json({
        success: false,
        message: "Food partner not found",
      });
    }

    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

/* ================= USER AUTH ================= */
async function authuserMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.jwt_secret);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authuserMiddleware,
};