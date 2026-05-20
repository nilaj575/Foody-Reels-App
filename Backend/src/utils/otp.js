const bcrypt = require("bcryptjs");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashOTP(otp) {
  return await bcrypt.hash(otp, 10);
}

async function verifyOTP(otp, hashedOTP) {
  return await bcrypt.compare(otp, hashedOTP);
}

module.exports = { generateOTP, hashOTP, verifyOTP };
