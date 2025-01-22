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
      const response = await axios.get(`http://localhost:5000/app/manageblogs?page=${currentPage}&limit=3`, {
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
        await axios.delete(`http://localhost:5000/app/deleteBlog/${id}`, { withCredentials: true });
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
      await axios.patch(`http://localhost:5000/app/updateBlog/${updatedBlog._id}`, updatedBlog, { withCredentials: true });
      setSelectedBlogId(null);
      fetchBlogs();
    } catch (err) {
      setError("Error updating blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
  <div className="container mx-auto px-4 py-8">
    {/* Back Button */}
    <button
      onClick={() => navigate("/home")}
      className="mb-8 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
    >
      Back to Home
    </button>

    <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">Manage My Blogs</h2>
    {error && (
      <p className="text-center text-red-500 mb-4 bg-red-100/10 py-2 rounded">{error}</p>
    )}

    <div className="grid grid-cols-1 gap-6 md:gap-8">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
              selectedBlogId === blog._id ? 'p-6' : 'p-4'
            }`}
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
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Categories:</label>
                    <input
                      type="text"
                      name="categories"
                      value={updatedBlog.categories}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tags:</label>
                    <input
                      type="text"
                      name="tags"
                      value={updatedBlog.tags}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBlogId(null)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="relative">
                <div className="mb-16">
                  <h3 className="text-xl font-semibold text-teal-400 mb-2">{blog.title}</h3>
                  <p className="text-gray-300">{blog.content.substring(0, 150)}...</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
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

    <div className="flex justify-between items-center mt-8">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
</div>

  );
};

export default ManageBlogs;