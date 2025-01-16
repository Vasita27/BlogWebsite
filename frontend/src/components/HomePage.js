import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); //To determine state of authentication.
  const [role, setRole] = useState(null);  //To store user role information for the display of addBlog button
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token'); // Get token from sessionStorage

  useEffect(() => {
    if (token) {
      // Try to access the home route to verify token on the backend
      axios.get('http://localhost:5000/app/home', {
        headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
      })
        .then((response) => {
          // Token is valid, user can access home page
          setIsAuthenticated(true);
          sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in sessionStorage - store as JSON to be able to read the user role.
          const user = JSON.parse(sessionStorage.getItem('user')); //Parse it 
          setRole(user?.role); // Set the user's role
        })
        .catch((error) => {
          // Token is invalid, redirect to login
          setIsAuthenticated(false);
          sessionStorage.removeItem('token'); // Remove invalid token
          navigate('/login'); // Redirect to login page
        });
    } else {
      setIsAuthenticated(false);
      navigate('/login'); // No token found, redirect to login
    }
  }, [token, navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Show loading while checking token validity
  }

  const handleAddBlogClick = () => {
    if (role === 'contentCreator') { //Recheck the role (not mandatory)
      navigate('/addblog'); // Redirect to Add Blog page if user is a contentCreator
    } else {
      alert('You do not have permission to add a blog'); // Show alert if user is not a contentCreator
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      {/* Show "Add Blog" button only for contentCreators */}
      {role === 'contentCreator' && (
        <button onClick={handleAddBlogClick}>Add Blog</button>
      )}
      {/* other home page content - To be added*/}
    </div>
  );
};

export default HomePage;
