import React, { useRef, useEffect, useState } from "react";
import "./reels.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { apiUrl } from "../config/api";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaArrowUp,
} from "react-icons/fa";

const Reels = () => {
  const [videos, setVideos] = useState([]);
  const [showComments, setShowComments] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const containerRef = useRef(null);

  /* ================= AUTOPLAY ================= */
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

    container.querySelectorAll(".reel-item").forEach((item) =>
      observer.observe(item)
    );

    return () => observer.disconnect();
  }, [videos]);

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    axios
      .get(apiUrl("/api/food"), { withCredentials: true })
      .then((res) => {
        const formatted = (res.data.foodItem || []).map((v) => ({
          ...v,
          isLiked: false,
          isSaved: false,
        }));
        setVideos(formatted);
      })
      .catch(console.error);
  }, []);

  /* ================= LIKE ================= */
  async function likeVideo(v) {
    const res = await axios.post(
      apiUrl("/api/food/like"),
      { foodId: v._id },
      { withCredentials: true }
    );

    setVideos((prev) =>
      prev.map((video) =>
        video._id === v._id
          ? {
              ...video,
              isLiked: res.data.like,
              likeCount: res.data.like
                ? video.likeCount + 1
                : video.likeCount - 1,
            }
          : video
      )
    );
  }

  /* ================= SAVE ================= */
  async function saveVideo(v) {
    const res = await axios.post(
      apiUrl("/api/food/save"),
      { foodId: v._id },
      { withCredentials: true }
    );

    setVideos((prev) =>
      prev.map((video) =>
        video._id === v._id
          ? {
              ...video,
              isSaved: res.data.save,
              saveVideo: video.saveVideo + (res.data.save ? 1 : -1),
            }
          : video
      )
    );
  }

  /* ================= OPEN COMMENTS ================= */
  async function openComments(foodId) {
    setShowComments(foodId);

    try {
      const res = await axios.get(
        apiUrl(`/api/food/comment/${foodId}`),
        { withCredentials: true }
      );

      const fetched =
        res.data.comments ||
        res.data.data ||
        res.data ||
        [];

      setComments(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  }

  /* ================= SUBMIT COMMENT ================= */
  async function submitComment() {
    if (!commentInput.trim()) return;

    const res = await axios.post(
      apiUrl("/api/food/comment"),
      { foodId: showComments, text: commentInput },
      { withCredentials: true }
    );

    if (res.data?.comment) {
      setComments((prev) => [res.data.comment, ...prev]);
    }

    setCommentInput("");
  }

  return (
    <>
      <div className="reels-container" ref={containerRef}>
        {videos.map((v) => (
          <div className="reel-item" key={v._id}>
            <video
              className="reel-video"
              src={v.video}
              playsInline
              loop
              muted
            />

            {/* RIGHT ACTIONS */}
            <div className="reel-actions">
              {/* LIKE */}
              <div className="reel-action">
                <span
                  className={`icon-btn ${v.isLiked ? "liked" : ""}`}
                  onClick={() => likeVideo(v)}
                >
                  {v.isLiked ? <FaHeart /> : <FaRegHeart />}
                </span>
                <span>{v.likeCount}</span>
              </div>

              {/* COMMENT */}
              <div
                className="reel-action"
                onClick={() => openComments(v._id)}
              >
                <FaRegComment />
                <span>{v.commentCount}</span>
              </div>

              {/* SAVE */}
              <div className="reel-action">
                <span
                  className={`icon-btn ${v.isSaved ? "saved" : ""}`}
                  onClick={() => saveVideo(v)}
                >
                  {v.isSaved ? <FaBookmark /> : <FaRegBookmark />}
                </span>
                <span>{v.saveVideo}</span>
              </div>
            </div>

            {/* BOTTOM OVERLAY */}
            <div className="reel-overlay">
              <div className="reel-description">{v.description}</div>
              <Link
                className="reel-visit"
                to={`/food-partner/${v.foodPartner}`}
              >
                Visit store
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* COMMENTS UI */}
      {showComments && (
        <div
          className="comment-backdrop"
          onClick={() => setShowComments(null)}
        >
          <div
            className="comment-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="comment-header">
              <span>Comments</span>
              <button onClick={() => setShowComments(null)}>✕</button>
            </div>

            <div className="comment-body">
              {comments.length === 0 && (
                <p style={{ color: "#aaa", textAlign: "center" }}>
                  No comments yet
                </p>
              )}

              {comments.map((c) => (
                <div className="comment-row" key={c._id}>
                  <img src="https://i.pravatar.cc/40" alt="" />
                  <div>
                    <b>{c.user?.name || "you"}</b> {c.text}
                    <div className="comment-meta">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="comment-emojis">😂 😍 😭 🔥 😮 😡</div>

            <div className="comment-input">
              <img src="https://i.pravatar.cc/36" alt="" />
              <input
                placeholder="Add a comment…"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button onClick={submitComment}>
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reels;