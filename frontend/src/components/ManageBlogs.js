import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ManageBlogs.module.css";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [updatedBlog, setUpdatedBlog] = useState({});
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("details"));

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  // Fetch all user blogs with pagination
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/app/manageblogs?page=${currentPage}&limit=3`, {
        withCredentials: true,
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load blogs");
    }
  };

  // Delete a blog with confirmation
  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/app/deleteBlog/${id}`, { withCredentials: true });
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (err) {
        setError("Error deleting blog");
      }
    }
  };

  // Open edit mode for a blog
  const handleEdit = (blog) => {
    setSelectedBlogId(blog._id);
    setUpdatedBlog(blog);
  };

  // Handle input change in edit form
  const handleChange = (e) => {
    setUpdatedBlog({ ...updatedBlog, [e.target.name]: e.target.value });
  };

  // Submit updated blog
  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/app/updateBlog/${updatedBlog._id}`, updatedBlog, { withCredentials: true });
      
      setSelectedBlogId(null);
      fetchBlogs();
    } catch (err) {
      setError("Error updating blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
  <div className="container mx-auto px-4 py-8">
    {/* Page Header */}
    <h2 className="text-3xl font-bold text-center mb-8">Manage My Blogs</h2>
    {error && (
      <p className="text-center text-red-500 mb-4">{error}</p>
    )}

    {/* Blog List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-gray-800 rounded-lg shadow-lg p-4 relative"
          >
            {selectedBlogId === blog._id ? (
              // Edit Form for the selected blog
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4 text-teal-400">Edit Blog</h3>
                <form onSubmit={updateBlog} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400">Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={updatedBlog.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400">Content:</label>
                    <textarea
                      name="content"
                      value={updatedBlog.content}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400">Categories:</label>
                    <input
                      type="text"
                      name="categories"
                      value={updatedBlog.categories}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400">Tags:</label>
                    <input
                      type="text"
                      name="tags"
                      value={updatedBlog.tags}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-teal-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-teal-400"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setSelectedBlogId(null)}
                      className="bg-red-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-red-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Blog Card with Edit & Delete Buttons
              <>
                <h3 className="text-xl font-semibold text-teal-400">{blog.title}</h3>
                <p className="text-gray-400 mb-4">{blog.content.substring(0, 100)}...</p>
                <div className="absolute bottom-4 left-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="bg-blue-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="bg-red-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-red-400"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No blogs found</p>
      )}
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</div>
  );
};

export default ManageBlogs;
