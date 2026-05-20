import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/success.css";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ⏳ auto redirect after 3 sec
    setTimeout(() => {
      navigate("/my-orders");
    }, 4000);
  }, [navigate]);

  return (
    <div className="success-page">

      {/* ✅ ANIMATION */}
      <div className="checkmark-circle">
        <div className="background"></div>
        <div className="checkmark draw"></div>
      </div>

      {/* ✅ TEXT */}
      <h2>Order Placed Successfully 🎉</h2>
      <p>Your food is being prepared 🍽️</p>

      {/* ✅ BUTTON */}
      <button onClick={() => navigate("/my-orders")}>
        Track Order
      </button>
    </div>
  );
};

export default Success;