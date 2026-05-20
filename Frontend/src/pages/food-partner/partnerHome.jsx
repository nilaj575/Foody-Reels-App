import { useState } from "react";
import "../../styles/partnerHome.css";

import { FaUser } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { MdReceipt } from "react-icons/md";

import FoodPartnerHome from "./foodProfile";
import CreateFood from "./CreateFood";
import Orders from "./order";

export default function FoodPartnerApp() {

  const [page, setPage] = useState("home");

  return (
    <div className="partner-app">

      {/* PAGE CONTENT */}
      <main className="partner-content">

        {page === "home" && (
          <div className="partner-page">
            <FoodPartnerHome />
          </div>
        )}

        {page === "create" && (
          <div className="partner-page">
            <CreateFood />
          </div>
        )}

        {page === "orders" && (
          <div className="partner-page">
            <Orders />
          </div>
        )}

      </main>

      {/* BOTTOM NAVBAR */}
      <nav className="partner-nav">

        <div
          className={`partner-nav-item ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          <FaUser />
          <span>Profile</span>
        </div>

        <div
          className={`partner-nav-item ${page === "create" ? "active" : ""}`}
          onClick={() => setPage("create")}
        >
          <MdFastfood />
          <span>Create Food</span>
        </div>

        <div
          className={`partner-nav-item ${page === "orders" ? "active" : ""}`}
          onClick={() => setPage("orders")}
        >
          <MdReceipt />
          <span>Orders</span>
        </div>

      </nav>

    </div>
  );
}