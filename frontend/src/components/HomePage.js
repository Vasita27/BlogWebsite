import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderType, setOrderType] = useState('latest'); // Default to latest order
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/app/home', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
        .then((response) => {
          setIsAuthenticated(true);
          sessionStorage.setItem('details', JSON.stringify(response.data.user));
          const user = JSON.parse(sessionStorage.getItem('details'));
          setRole(user?.role);
        })
        .catch((error) => {
          setIsAuthenticated(false);
          sessionStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      setIsAuthenticated(false);
      navigate('/login');
    }

    fetchBlogs(orderType, currentPage);

  }, [token, navigate, currentPage, orderType]);

  const fetchBlogs = (order, page) => {
    
    const url = `http://localhost:5000/app/getBlogs?page=${page}&limit=4&order=${order}`;
    axios.get(url,{withCredentials:true})
      .then(response => {
        
        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
      });
  };

  const handleAddBlogClick = (e) => {
    e.preventDefault()
    if (role === 'contentCreator') {
      navigate('/addblog');
    } else {
      alert('You do not have permission to add a blog');
    }
  };

  const handleReadMore = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleLikeClick = (blogId, isLiked) => {
    axios.post(`http://localhost:5000/app/like/${blogId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
      .then(response => {
        const updatedBlogs = blogs.map(blog =>
          blog._id === blogId
            ? { ...blog, likes: response.data.updatedBlog.likes, isLiked: !isLiked }
            : blog
        );
        setBlogs(updatedBlogs);
      })
      .catch(error => {
        console.error('Error liking blog:', error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOrderChange = (order) => {
    setOrderType(order);
    setCurrentPage(1); // Reset to the first page
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
  <div className="container mx-auto px-4 py-8">
    {/* Header Section */}
    <h1 className="text-4xl font-bold text-center mb-8">Our Insights and Stories</h1>
    <p className="text-center text-gray-400 mb-6">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </p>

    {/* Role-Specific Buttons */}
    {role === "contentCreator" && (
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={handleAddBlogClick}
          className="bg-teal-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-teal-400"
        >
          Add Blog
        </button>
        <button
          onClick={() => navigate("/manageblogs")}
          className="bg-blue-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-blue-400"
        >
          Manage
        </button>
      </div>
    )}

    {/* Order Buttons */}
    <div className="flex justify-center space-x-4 mb-8">
      <button
        onClick={() => handleOrderChange("latest")}
        className="bg-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-600"
      >
        See Latest
      </button>
      <button
        onClick={() => handleOrderChange("trending")}
        className="bg-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-600"
      >
        See Trending
      </button>
    </div>

    {/* Blogs Container */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <div
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          key={blog._id}
        >
          {/* Blog Image */}
          <div className="relative h-48 bg-gray-700">
            {blog.images && (
              <img
                src={`http://localhost:5000${blog.images}`}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <p className='text-gray-400'>
    Published On:{" "}
    {new Date(blog.updatedAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}{" "}
    at{" "}
    {new Date(blog.updatedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
  </p>

          {/* Blog Content */}
          {console.log(blog.updatedAt)}
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-teal-400">
              {blog.title}
            </h3>
            <p className="text-gray-400 mb-4">
              {blog.content.substring(0, 100)}...
            </p>

            {/* Blog Metadata */}
            <div className="text-sm text-gray-500 mb-4">
              <p>By {blog.author}</p>
              <p>Tags: {blog.tags.join(", ")}</p>
              <p>Categories: {blog.categories.join(", ")}</p>
            </div>

            {/* Read More Button */}
            <button
              onClick={() => handleReadMore(blog._id)}
              className="bg-teal-500 text-black py-2 px-4 rounded-lg shadow-md hover:bg-teal-400"
            >
              Read More
            </button>

            {/* Like Button */}
            <div className="mt-4">
              <button
                onClick={() => handleLikeClick(blog._id, blog.isLiked)}
                className={`py-2 px-4 rounded-lg shadow-md ${
                  blog.isLiked ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {blog.isLiked ? "Unlike" : "Like"} {blog.likes.length}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
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

export default HomePage;
