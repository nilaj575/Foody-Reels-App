const User = require("../models/user.model");
const FoodPartner = require("../models/foodPartner.model");
const { verifyOTP } = require("../utils/otp");

async function verifyUserOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await verifyOTP(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "User account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyFoodPartnerOTP(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const partner = await FoodPartner.findOne({ email });
    if (!partner) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    if (partner.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await verifyOTP(otp, partner.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    partner.isVerified = true;
    partner.otp = undefined;
    partner.otpExpiry = undefined;
    await partner.save();

    res.json({ message: "Food partner verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = { verifyFoodPartnerOTP, verifyUserOTP };
