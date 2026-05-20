import React, { useEffect, useState } from "react";
import "../../styles/save.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config/api";

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(
          apiUrl("/api/food/save"),
          { withCredentials: true }
        );

        // ✅ SAFE EXTRACTION
        const saveFoods = Array.isArray(res.data?.saveFoods)
          ? res.data.saveFoods
          : [];

        const extractedVideos = saveFoods
          .map((item) => item?.foodItem)
          .filter(Boolean); // remove nulls

        setVideos(extractedVideos);
      } catch (err) {
        console.error("Failed to load saved videos", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const openReels = (index) => {
    if (!videos.length) return;

    navigate("/save-reels", {
      state: {
        videos,
        startIndex: index,
      },
    });
  };

  if (loading) {
    return <div className="saved-loading">Loading saved videos...</div>;
  }

  return (
    <main className="saved-page">
      <section className="saved-header">
        <h1>Saved</h1>
        <p>Your saved videos</p>
      </section>

      {videos.length === 0 ? (
        <p className="saved-empty">No saved videos yet</p>
      ) : (
        <section className="saved-grid">
          {videos.map((v, i) => (
            <div
              key={v._id}
              className="saved-grid-item"
              onClick={() => openReels(i)}
            >
              <video
                className="saved-grid-video"
                src={v.video}
                muted
                playsInline
                preload="metadata"
              />
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default Saved;