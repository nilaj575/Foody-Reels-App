import { useState, useRef } from "react";
import "../../styles/home.css";
import { FaHome, FaBookmark } from "react-icons/fa";
import {MdReceipt} from "react-icons/md";
import Home from "../general/Home";
import Saved from "./save";
import UserHome from "../user/userHome";
import Orders from"../user/userOrders";

const videos = ["Video 1", "Video 2", "Video 3"];

export default function App() {
  const [page, setPage] = useState("home");
  const [index, setIndex] = useState(0);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;

    if (diff > 50 && index < videos.length - 1) {
      setIndex((p) => p + 1);
    }
    if (diff < -50 && index > 0) {
      setIndex((p) => p - 1);
    }
  };

  return (
    <div className="app">
      {/* MAIN CONTENT */}
      <main className="page-content">

        {page==="home" && <UserHome />}
        

        {page === "video" && (
          <div
            className="video-wrapper"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="video-box">
              <Home />
            </div>
          </div>
        )}

        {page === "saved" && (
          <div className="saved-page"><Saved /></div>
        )}

        {page === "orders" && (
          <div className="orders-page">
            <Orders />
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <div
          className={`nav-item ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          <FaHome />
        </div>

        <div
          className={`nav-item ${page === "video" ? "active" : ""}`}
          onClick={() => setPage("video")}
        >
          🎬
        </div>

        <div
          className={`nav-item ${page === "saved" ? "active" : ""}`}
          onClick={() => setPage("saved")}
        >
          <FaBookmark />
        </div>

        <div
          className={`nav-item ${page === "orders" ? "active" : ""}`}
          onClick={() => setPage("orders")}
        >
          <MdReceipt />
        </div>
      </nav>
    </div>
  );
}