import React, { useEffect, useState } from "react";
import "../../styles/userHome.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const UserHome = () => {

  const [partners, setPartners] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isLogin = localStorage.getItem("isLogin");
  const storedImage = localStorage.getItem("userImage");

  /* RANDOM IMAGE FOR LOGGED USER */
  const randomAvatar =
    "https://i.pravatar.cc/36" +
    Math.floor(Math.random() * 10000);

  const profileImage = isLogin
    ? storedImage || randomAvatar
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    getPartners();
  }, []);

  const getPartners = async () => {
    try {

      const res = await axios.get(
        apiUrl("/api/food-partner/all")
      );

      setPartners(res.data.foodPartners);

    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = async () => {

    try {

      await axios.post(
        apiUrl("/api/auth/user/logout"),
        {},
        { withCredentials: true }
      );

    } catch (error) {
      console.log("logout error:", error);
    }

    localStorage.removeItem("isLogin");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userId");

    navigate("/user/login");
  };

  return (

    <div className="user-home">

      {/* HEADER */}
      <div className="home-header">

        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="banner"
        />

        {/* RIGHT SIDE ICONS */}
        <div className="header-icons">

          <div
            className="profile"
            onClick={() => setMenuOpen(!menuOpen)}
          >

            <img
              src={profileImage}
              alt="profile"
              className="profile-img"
            />

            {menuOpen && (

              <div className="profile-dropdown">

                {isLogin ? (
                  <>
                    <div onClick={() => navigate("/update-profile")}>
                      Update Profile
                    </div>

                    <div onClick={logoutUser}>
                      Logout
                    </div>
                  </>
                ) : (
                  <div onClick={() => navigate("/user/login")}>
                    Login
                  </div>
                )}

              </div>

            )}

          </div>

        </div>

        {/* SEARCH */}
        <div className="search-bar">
          <input
            type="text"
            placeholder='Search "food"'
          />
        </div>

      </div>

      {/* SHOP LIST */}
      <div className="shop-list">

        {partners.map((v) => (

          <div className="shop-card" key={v._id}>

            <div className="shop-img">

              <img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                alt="food"
              />

              <span className="shop-name">
                {v.name}
              </span>

            </div>

            <div className="shop-info">

              <div className="shop-top">

                <h3>{v.name}</h3>

                <span className="rating">
                  4.2 ⭐
                </span>

              </div>

              <p className="address">
                {v.address}
              </p>

              <Link
                className="reel-visit"
                to={`/food-partner/${v._id}`}
              >
                Visit store
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default UserHome;