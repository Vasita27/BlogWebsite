import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`https://blogwebsite-2-7quo.onrender.com/app/manageblogs?page=${currentPage}&limit=3`, {
        withCredentials: true,
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load blogs");
    }
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://blogwebsite-2-7quo.onrender.com/app/deleteBlog/${id}`, { withCredentials: true });
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (err) {
        setError("Error deleting blog");
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlogId(blog._id);
    setUpdatedBlog(blog);
  };

  const handleChange = (e) => {
    setUpdatedBlog({ ...updatedBlog, [e.target.name]: e.target.value });
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`https://blogwebsite-2-7quo.onrender.com/app/updateBlog/${updatedBlog._id}`, updatedBlog, { withCredentials: true });
      setSelectedBlogId(null);
      fetchBlogs();
    } catch (err) {
      setError("Error updating blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="mb-8 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          Back to Home
        </button>

        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-teal-400">Manage My Blogs</h2>

        {error && (
          <p className="text-center text-red-500 mb-4 bg-red-100/10 py-2 rounded">{error}</p>
        )}

        {/* Blog Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 p-4 sm:p-6"
              >
                {selectedBlogId === blog._id ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-teal-400 mb-4">Edit Blog</h3>
                    <form onSubmit={updateBlog} className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Title:</label>
                        <input
                          type="text"
                          name="title"
                          value={updatedBlog.title}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-teal-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Content:</label>
                        <textarea
                          name="content"
                          value={updatedBlog.content}
                          onChange={handleChange}
                          required
                          rows="4"
                          className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-teal-400 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBlogId(null)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-all"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-teal-400 mb-2">{blog.title}</h3>
                    <p className="text-gray-300">{blog.content.substring(0, 100)}...</p>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBlog(blog._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-8">No blogs found</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-8 space-y-4 sm:space-y-0">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogs;
