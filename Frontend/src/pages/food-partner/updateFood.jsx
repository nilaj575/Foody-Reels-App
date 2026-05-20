import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/updateFood.css";
import { apiUrl } from "../../config/api";

const UpdateFood = () => {
  const { id } = useParams(); // foodId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  /* ================= FETCH FOOD DETAILS ================= */
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(
          apiUrl(`/api/food/${id}`),
          { withCredentials: true }
        );

        const foodData = res.data.foodItem;

        setFood(foodData);
        setFormData({
          name: foodData.name || "",
          description: foodData.description || "",
          price: foodData.price || "",
        });

        setLoading(false);
      } catch (err) {
        alert("Failed to load food details");
        navigate(-1);
      }
    };

    fetchFood();
  }, [id, navigate]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE FOOD ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        apiUrl(`/api/food/update/${id}`),
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
        },
        { withCredentials: true }
      );

      alert("Food updated successfully");
      navigate(-1);
    } catch (err) {
      alert("Failed to update food");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <main className="update-food-page">
      <h1 className="update-title">Update Food</h1>

      {/* ===== FOOD PREVIEW ===== */}
      <div className="food-preview">
        
          <video
            src={food.video}
            muted
            autoPlay
            loop
            playsInline
            className="food-video"
          />
  
      </div>

      {/* ===== UPDATE FORM ===== */}
      <form className="update-form" onSubmit={handleSubmit}>
        <label>
          Food Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </label>

        <label>
          Price (₹)
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="update-btn">
          Update Food
        </button>
      </form>
    </main>
  );
};

export default UpdateFood;