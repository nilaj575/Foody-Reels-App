import React, { useState, useEffect } from "react";
import "../../styles/foodProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
  const fetchOwnProfile = async () => {
    try {
      const res = await axios.get(
        apiUrl("/api/food-partner/own"),
        { withCredentials: true }
      );

      // ✅ CORRECT RESPONSE HANDLING
      setProfile(res.data.foodPartner);
      setFoods(res.data.foodItems || []);

    } catch (err) {
      console.log(
        "OWN PROFILE ERROR:",
        err.response?.data || err.message
      );
    }
  };

  fetchOwnProfile();
}, []);

  /* ===== REMOVE FOOD ===== */
  const removeFood = async (foodId) => {
    if (!window.confirm("Remove this food item?")) return;

    try {
      await axios.delete(
        apiUrl(`/api/food/${foodId}`),
        { withCredentials: true }
      );

      setFoods((prev) => prev.filter((f) => f._id !== foodId));
    } catch (err) {
      alert("Failed to remove food");
    }
  };

  return (
    <main className="profile-page">
      {/* ===== PROFILE HEADER ===== */}
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
        {foods.map((food) => (
          <div key={food._id} className="food-card">
              <video
                className="food-media"
                src={food.video}
                muted
                autoPlay
                loop
                playsInline
              />

            <h4>{food.name}</h4>
            <p className="food-weight">{food.weight}</p>

            <div className="food-price">
              ₹{food.price}
              {food.originalPrice && (
                <span>₹{food.originalPrice}</span>
              )}
            </div>

            {/* ===== UPDATE / REMOVE BAR ===== */}
            <div className="food-action-bar">
              <button
                className="food-update-btn"
                onClick={() =>
                  navigate(`/update-food/${food._id}`)
                }
              >
                Update
              </button>

              <button
                className="food-remove-btn"
                onClick={() => removeFood(food._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;