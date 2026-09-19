const axios = require("axios");

async function sendOTP(email, otp) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME || "Foody Reels App",
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "Your OTP Code",

        textContent: `Your OTP is ${otp}. It is valid for 5 minutes.`,

        htmlContent: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Foody Reels App</h2>
            <p>Your OTP is:</p>

            <h1 style="letter-spacing: 5px;">
              ${otp}
            </h1>

            <p>This OTP is valid for 5 minutes.</p>

            <p>If you did not request this OTP, please ignore this email.</p>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("OTP email sent successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "BREVO EMAIL ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
}

module.exports = {
  sendOTP,
};