import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../../styles/saveReel.css";
import { FaRegHeart, FaRegComment, FaRegBookmark } from "react-icons/fa";

const SavedReels = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const videos = state?.videos || [];
  const startIndex = state?.startIndex || 0;

  // redirect if opened directly
  useEffect(() => {
    if (!state) {
      navigate("/save");
    }
  }, [state, navigate]);

  // autoplay observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (!video) return;

          entry.isIntersecting && entry.intersectionRatio > 0.75
            ? video.play().catch(() => {})
            : video.pause();
        });
      },
      { root: container, threshold: [0.75] }
    );

    container.querySelectorAll(".saved-reel-item").forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [videos]);

  // scroll to clicked reel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const el = container.children[startIndex];
    if (el) el.scrollIntoView({ behavior: "auto" });
  }, [startIndex]);

  return (
    <div className="saved-reels-container" ref={containerRef}>
      {videos.map((v) => (
        <div className="saved-reel-item" key={v._id}>
          <video
            className="saved-reel-video"
            src={v.video}
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* ACTIONS */}
          <div className="saved-reel-actions">
            <div className="saved-reel-action">
              <FaRegHeart />
              <span>{v.likeCount || 0}</span>
            </div>

            <div className="saved-reel-action">
              <FaRegComment />
              <span>0</span>
            </div>

            <div className="saved-reel-action">
              <FaRegBookmark />
              <span>{v.saveVideo || 0}</span>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="saved-reel-overlay">
            <p className="saved-reel-description">{v.description}</p>

            <Link
              to={`/food-partner/${v.foodPartner}`}
              className="saved-reel-visit"
            >
              Visit store
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedReels;