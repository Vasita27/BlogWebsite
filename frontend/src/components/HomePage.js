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

  const handleAddBlogClick = () => {
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
    <div>
      <h1>Welcome to the Home Page!</h1>
      {role === 'contentCreator' && (
        <div>
          <button onClick={handleAddBlogClick}>Add Blog</button>
          <button onClick={() => { navigate('/manageblogs') }}>Manage</button>
        </div>
      )}

      <div>
        <button onClick={() => handleOrderChange('latest')}>See Latest</button>
        <button onClick={() => handleOrderChange('trending')}>See Trending</button>
      </div>

      <div className="blogs-container">
        {blogs.map(blog => (
          <div className="blog-card" key={blog._id}>
            <div className="image-container">
              {blog.images && <img src={`http://localhost:5000${blog.images}`} alt={blog.title} />}
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>
              <p>{blog.content.substring(0, 100)}...</p>
              <div className="blog-meta">
                <p>By {blog.author}</p>
                <p>Tags: {blog.tags.join(", ")}</p>
                <p>Categories: {blog.categories.join(", ")}</p>
              </div>
              <button onClick={() => handleReadMore(blog._id)} className="read-more">
                Read More
              </button>
              <div className="like-container">
                <button
                  onClick={() => handleLikeClick(blog._id, blog.isLiked)}
                  className={`like-btn ${blog.isLiked ? 'liked' : ''}`}
                >
                  Like {blog.likes.length}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
