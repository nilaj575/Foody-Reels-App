const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
const emailPort = Number(process.env.EMAIL_PORT || 587);

function createTransporter(port, secure) {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port,
    secure,
    requireTLS: !secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

const transporter = createTransporter(
  emailPort,
  process.env.EMAIL_SECURE === "true"
);

const fallbackTransporter = emailPort === 587
  ? createTransporter(465, true)
  : null;

async function sendMail(message) {
  try {
    return await transporter.sendMail(message);
  } catch (error) {
    if (!fallbackTransporter) throw error;

    console.error("Primary SMTP attempt failed:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.message,
    });
    return fallbackTransporter.sendMail(message);
  }
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
