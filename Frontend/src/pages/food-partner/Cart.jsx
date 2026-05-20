import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cart.css";
import { apiUrl } from "../../config/api";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cart = location.state?.cart || {};
  const foodPartnerId = location.state?.foodPartnerId;
  const items = Object.values(cart);

  const [paymentMethod, setPaymentMethod] = useState("online");

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        apiUrl("/api/order"),
        {
          foodPartner: foodPartnerId,
          totalAmount: total,
          paymentMethod,
          items: items.map(i => ({
            foodItem: i._id,
            name: i.name,
            price: i.price,
            quantity: i.qty
          }))
        },
        { withCredentials: true }
      );

      // 🔁 CASH → success page
      if (paymentMethod === "cash") {
        navigate("/success");
      } 
      // 🔁 ONLINE → payment page
      else {
        navigate(`/payment/${res.data._id}`);
      }

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  return (
    <main className="cart-page">
      <header className="cart-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h2>Your Cart</h2>
      </header>

      <section className="cart-items">
        {items.map(item => (
          <div key={item._id} className="cart-item">

            <video
              src={item.video}
              muted
              autoPlay
              loop
              playsInline
              className="cart-video"
            />

            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>₹{item.price} × {item.qty}</p>
            </div>

          </div>
          
        ))}
      </section>

      {/* PAYMENT METHOD */}
      <div className="payment-method">
        <h4>Payment Method</h4>

        <label>
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />
          Online (Google Pay / PhonePe / UPI)
        </label>

        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />
          Cash on Delivery
        </label>
      </div>

      <footer className="cart-footer">
        <strong>Total: ₹{total}</strong>
        <button className="checkout-btn" onClick={handleCheckout}>
          Place Order
        </button>
      </footer>
    </main>
  );
};

export default Cart;