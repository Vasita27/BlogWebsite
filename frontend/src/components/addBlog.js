import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  // State hooks to manage form data
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);  // State for storing the selected image
  const navigate = useNavigate();

  // Effect hook to check if the user is logged in by checking the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token is found
      navigate("/login");
    }
  }, [navigate]);

  // Handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);  // Store the selected image file in state
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if token is missing during form submission
      navigate("/login");
      return;
    }

    // Prepare FormData for image upload along with blog data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categories", categories.split(","));
    formData.append("tags", tags.split(","));

    if (image) {
      formData.append("image", image);  // Append the image file if it's provided
    }

    try {
      // Sending the form data (with image) to the backend
      await axios.post("http://localhost:5000/app/createBlog", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Redirect to home page upon successful submission
      navigate("/home");
    } catch (error) {
      // Show an error message if submission fails
      alert("Failed to create blog");
    }
  };

  return (
    <div className="container">
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title state on change
          required
        />

        {/* Blog Content Textarea */}
        <textarea
          placeholder="Write your blog content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)} // Update content state on change
          rows="10"
          required
        />

        {/* Categories Input */}
        <input
          type="text"
          placeholder="Categories (comma-separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)} // Update categories state on change
          required
        />

        {/* Tags Input */}
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)} // Update tags state on change
        />

        {/* Image Upload Input (Optional) */}
        <input
          type="file"
          accept="image/*" // Allow only image files
          onChange={handleImageChange} // Handle image selection
        />

        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreateBlog;
