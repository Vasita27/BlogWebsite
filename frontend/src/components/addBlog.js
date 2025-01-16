
// This is placeholder code file. It's not functional yet.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/app/createBlog'; // This route is not defined yet.

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

  useEffect(() => {
    // If no token is found, redirect to login
    if (!token) {
      alert('You must be logged in to add a blog');
      navigate('/login'); // Redirect to login if no token found
    }
  }, [token, navigate]); // Dependency on token to check when it changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to add a blog');
      navigate('/login');
      return;
    }

    try {
      const blogData = { title, content };
      const response = await axios.post(
        `${API_URL}`,
        blogData,
        {
          headers: { Authorization: `Bearer ${token}` }, // Send token in the header
        }
      );
      if (response.status === 200) {
        alert('Blog added successfully');
        navigate('/home'); // Redirect to home after successful blog creation
      }
    } catch (error) {
      alert('Failed to create blog');
    }
  };

  return (
    <div>
      <h2>Add Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
