

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegister from '../pages/UserRegister';
import UserOTP from '../pages/UserOTP';
import UserLogin from '../pages/UserLogin';
import PartnerRegister from '../pages/PartnerRegister';
import PartnerOTP from '../pages/PartnerOTP';
import PartnerLogin from '../pages/PartnerLogin';
import Home from '../pages/general/Home';
import Profile from "../pages/food-partner/Profile";
import CreateFood  from "../pages/food-partner/CreateFood";
import  App from'../pages/general/app';
import Saved from "../pages/general/save";
import SavedReels from "../pages/user/saveReels";
import Cart from "../pages/food-partner/Cart";
import FoodProfile from "../pages/food-partner/foodProfile"
import UpdateFood from "../pages/food-partner/updatefood";
import Payment  from "../pages/user/payment";
import PartnerOrders from "../pages/food-partner/order";
import Success from "../pages/succes";
import UserOrders from "../pages/user/userOrders";
import UserHome from "../pages/user/userHome";
import PartnerHome from"../pages/food-partner/partnerHome";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/otp" element={<UserOTP />} />
        <Route path="/user/login" element={<UserLogin />} />

        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/otp" element={<PartnerOTP />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:id"  element={<Profile/>}  />
        <Route path="/app" element={<App />} />
        <Route path="/save" element={<Saved/>} />
        <Route path="/save-reels" element={<SavedReels/>}/>
        <Route path="/cart" element={<Cart/>} />
        <Route path="/food-profile" element={<FoodProfile/>} />
        <Route path="/update-food/:id" element={<UpdateFood/>} />
        <Route path="/payment/:orderId" element={<Payment/>} />
        <Route path="/partner/orders" element={<PartnerOrders />} />
        <Route path="/success" element={<Success />} />
        <Route path="/my-orders" element={<UserOrders />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/partner-home" element={<PartnerHome />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
