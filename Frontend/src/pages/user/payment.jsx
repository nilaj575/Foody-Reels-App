import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import "../../styles/payment.css"
import { apiUrl } from "../../config/api";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId || orderId.length !== 24) {
      alert("Invalid order ID");
      navigate("/user-home");
    }
  }, [orderId, navigate]);

  // 🔥 COMMON PAYMENT FUNCTION (used by all buttons)
  const startPayment = async () => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return alert("Razorpay failed");

      const res = await axios.post(
        apiUrl("/api/payment/create"),
        { orderId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.amount,
        currency: "INR",
        order_id: res.data.id,
        name: "Nilaj's Food App",

        handler: async function (response) {
          await axios.post(
            apiUrl("/api/payment/verify"),
            { ...response, orderId },
            { withCredentials: true }
          );

          navigate("/success");
        },

        theme: { color: "#ff5a5f" } // Zomato style color
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="payment-page">
      <h2>Choose Payment Method</h2>

      {/* 🔥 UPI APPS (SWIGGY STYLE) */}
      <div className="upi-grid">
        <button className="upi-btn gpay" onClick={startPayment}>
          Google Pay
        </button>

        <button className="upi-btn phonepe" onClick={startPayment}>
          PhonePe
        </button>

        <button className="upi-btn paytm" onClick={startPayment}>
          Paytm
        </button>
      </div>

      {/* OTHER OPTIONS */}
      <div className="other-pay">
        <button className="pay-btn" onClick={startPayment}>
          Pay via Card / Net Banking
        </button>
      </div>
    </div>
  );
};

export default Payment;