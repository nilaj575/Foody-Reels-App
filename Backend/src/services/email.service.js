const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

async function sendMail(message) {
  return transporter.sendMail(message);
}

async function sendOTP(email, otp) {
  await sendMail({
    from: `"Foody Reels App" <${emailUser}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
}

module.exports = { sendOTP };
