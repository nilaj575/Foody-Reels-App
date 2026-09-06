const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true",
  requireTLS: process.env.EMAIL_SECURE !== "true",
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"Foody Reels App" <${emailUser}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
}

module.exports = { sendOTP };
