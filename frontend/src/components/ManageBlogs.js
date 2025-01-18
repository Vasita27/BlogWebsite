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
    <div className={styles.container}>
      <h2 className={styles.heading}>Manage My Blogs</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Blog List with Edit and Delete Buttons */}
      <div className={styles.blogList}>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className={styles.blogCard}>
              {selectedBlogId === blog._id ? (
                // Edit Form for the selected blog
                <div className={styles.editForm}>
                  <h3>Edit Blog</h3>
                  <form onSubmit={updateBlog}>
                    <label>Title:</label>
                    <input type="text" name="title" value={updatedBlog.title} onChange={handleChange} required />

                    <label>Content:</label>
                    <textarea name="content" value={updatedBlog.content} onChange={handleChange} required />

                    <label>Categories:</label>
                    <input type="text" name="categories" value={updatedBlog.categories} onChange={handleChange} />

                    <label>Tags:</label>
                    <input type="text" name="tags" value={updatedBlog.tags} onChange={handleChange} />

                    <button type="submit" className={styles.updateBtn}>Update</button>
                    <button onClick={() => setSelectedBlogId(null)} className={styles.cancelBtn}>Cancel</button>
                  </form>
                </div>
              ) : (
                // Blog Card with Edit & Delete
                <>
                  <h3>{blog.title}</h3>
                  <p>{blog.content.substring(0, 100)}...</p>
                  <div className={styles.buttons}>
                    <button onClick={() => handleEdit(blog)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => deleteBlog(blog._id)} className={styles.deleteBtn}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageBlogs;
