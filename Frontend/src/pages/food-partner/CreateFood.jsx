

import { useRef, useState } from "react";
import "../../styles/createFood.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config/api";


const CreateFood = () => {
  const inputRef = useRef(null);
  const navigate=useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [name, setName] = useState("");
  const [price,setPrice]=useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setVideoFile(null);
    setPreview("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleChange = () => {
    inputRef.current?.click();
  };

  // ✅ SUBMIT HANDLER
  const handleSubmit = async () => {
    if (!videoFile || !name.trim()) {
      alert("Video and name are required");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);

    try {
      setLoading(true);

      const res = await axios.post(
        apiUrl("/api/food"),
        formData,
        {
          withCredentials: true
        }
      );

      alert("Food created successfully!");

      // ✅ Reset form
      setVideoFile(null);
      setPreview("");
      setName("");
      setDescription("");
      inputRef.current.value = "";

      console.log(res.data);
      navigate('/partner-home');
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <h2>Create Food</h2>
        <p className="subtitle">
          Upload a short video, give it a name, and add a description.
        </p>

        {/* FILE INPUT ALWAYS MOUNTED */}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/mov"
          hidden
          onChange={handleVideoChange}
        />

        {/* Upload UI */}
        {!videoFile && (
          <div
            className="upload-box"
            onClick={() => inputRef.current.click()}
          >
            <span className="upload-icon">⬆️</span>
            <p>Tap to upload or drag and drop</p>
            <small>MP4, WebM, MOV • Up to 100MB</small>
          </div>
        )}

        {/* Selected Video */}
        {videoFile && (
          <>
            <div className="video-file-row">
              <span className="file-name">{videoFile.name}</span>

              <div className="file-actions">
                <button type="button" onClick={handleChange}>
                  Change
                </button>
                <button
                  type="button"
                  className="remove"
                  onClick={handleRemove}
                >
                  Remove
                </button>
              </div>
            </div>

            <video className="video-preview" src={preview} controls />
          </>
        )}

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spicy Paneer Wrap"
          />
        </div>
        <div className="form-group">
          <label>price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 150"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description: ingredients, taste, spice level, etc."
          />
        </div>

        <button
          className="save-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Food"}
        </button>
      </div>
    </div>
  );
};

export default CreateFood;
