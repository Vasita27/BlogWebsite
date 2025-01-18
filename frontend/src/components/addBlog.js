import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Upload the image first if there is one
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        setMessage("Image upload failed. Try again.");
        return;
      }
    }

    // Prepare the blog data to be submitted (including the image URL)
    const blogData = {
      title,
      content,
      categories: categories.split(","), // Convert to array
      tags: tags.split(","), // Convert to array
      imageUrl, // Include the image URL if an image was uploaded
    };

    try {
      const response = await axios.post("http://localhost:5000/app/createBlog", blogData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setMessage("Blog created successfully! Redirecting...");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      setMessage("Failed to create blog. Please try again.");
    }
  };

  // Function to upload the image
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", image); // Attach the image file

    try {
      const response = await axios.post("http://localhost:5000/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl; // Assuming the backend returns the image URL
    } catch (error) {
      console.error("Image upload failed", error);
      return null;
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create a New Blog</h2>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categories (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Technology, Health"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., React, MongoDB, Node"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div className="mb-3 text-center">
            <p>Image Preview:</p>
            <img src={imagePreview} alt="Preview" className="img-fluid rounded shadow" width="200" />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">Publish</button>
      </form>
    </div>
  );
};

export default CreateBlog;
