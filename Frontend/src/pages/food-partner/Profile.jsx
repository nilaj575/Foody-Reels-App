import React, { useState, useEffect } from "react";
import "../../styles/profile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    axios
      .get(apiUrl(`/api/food-partner/${id}`), {
        withCredentials: true,
      })
      .then((res) => {
        const fp = res.data.foodPartner || res.data;
        setProfile(fp);
        setFoods(fp.foodItems || []);
      })
      .catch(() => {});
  }, [id]);

  const updateCart = (food, change = 1) => {
    setCart((prev) => {
      const qty = (prev[food._id]?.qty || 0) + change;
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[food._id];
        return copy;
      }
      return { ...prev, [food._id]: { ...food, qty } };
    });
  };

  const cartItems = Object.values(cart);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <main className="profile-page">
      {/* ===== PROFILE HEADER (UNCHANGED) ===== */}
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src={
              profile?.avatar ||
              "https://images.unsplash.com/photo-1754653099086-3bddb9346d37"
            }
            alt=""
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business">
              {profile?.name || "—"}
            </h1>
            <p className="profile-pill profile-address">
              {profile?.address || "Address not available"}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-label">total meals</span>
            <span className="profile-stat-value">
              {profile?.totalMeals ?? 0}
            </span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">customers served</span>
            <span className="profile-stat-value">
              {profile?.customersServed ?? 0}
            </span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      {/* ===== FOOD GRID ===== */}
      <section className="food-grid">
        {foods.map((food) => {
          const qty = cart[food._id]?.qty || 0;

          return (
            <div key={food._id} className="food-card">
              
                <video
                  className="food-media"
                  src={food.video}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                />

              <h4>{food.name}</h4>
              <p className="food-weight">{food.weight}</p>

              <div className="food-price">
                ₹{food.price}
                {food.originalPrice && (
                  <span>₹{food.originalPrice}</span>
                )}
              </div>

              {qty === 0 ? (
                <button
                  className="add-btn"
                  onClick={() => updateCart(food, 1)}
                >
                  ADD
                </button>
              ) : (
                <div className="qty-control">
                  <button onClick={() => updateCart(food, -1)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => updateCart(food, 1)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ===== CART POPUP ===== */}
      {cartItems.length > 0 && (
        <div className="cart-popup">
          <div>
            <strong>{cartItems.length} Items</strong> | ₹{totalPrice}
          </div>
          <button onClick={() => navigate("/cart", { state: { cart,  foodPartnerId: profile._id } })}>
            VIEW CART
          </button>
        </div>
      )}
    </main>
  );
};

export default Profile;