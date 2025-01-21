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
    const token = sessionStorage.getItem("token");
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
  <h2 className="text-3xl font-bold mb-6 text-center">Create a New Blog</h2>

  {message && (
    <div
      className={`w-full max-w-lg p-4 mb-6 rounded-lg text-center ${
        message.includes("success")
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {message}
    </div>
  )}

  <form
    onSubmit={handleSubmit}
    className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg"
  >
    {/* Title Field */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Title</label>
      <input
        type="text"
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 outline-none focus:ring focus:ring-teal-400"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>

    {/* Content Field */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Content</label>
      <textarea
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 outline-none focus:ring focus:ring-teal-400"
        placeholder="Write your blog content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="6"
        required
      />
    </div>

    {/* Categories Field */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Categories (comma-separated)
      </label>
      <input
        type="text"
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 outline-none focus:ring focus:ring-teal-400"
        placeholder="e.g., Technology, Health"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
        required
      />
    </div>

    {/* Tags Field */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
      <input
        type="text"
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 outline-none focus:ring focus:ring-teal-400"
        placeholder="e.g., React, MongoDB, Node"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
    </div>

    {/* Upload Image Field */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Upload Image</label>
      <input
        type="file"
        className="w-full bg-gray-700 border border-gray-600 text-gray-400 rounded-lg py-2 px-3 outline-none focus:ring focus:ring-teal-400"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>

    {/* Image Preview */}
    {imagePreview && (
      <div className="mb-6 text-center">
        <p className="text-sm mb-2">Image Preview:</p>
        <img
          src={imagePreview}
          alt="Preview"
          className="rounded-lg shadow-lg max-w-xs mx-auto"
        />
      </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-teal-500 hover:bg-teal-400 text-black font-medium py-2 px-4 rounded-lg transition duration-300"
    >
      Publish
    </button>
  </form>
</div>

  );
};

export default CreateBlog;
