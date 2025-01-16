import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';

const API_URL = 'http://localhost:5000/auth'; // Actual backend route will be replaced after hosting.

const Login = () => {
  //states for management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { username, password };
      const response = await axios.post(`${API_URL}/login`, userData); //Send the data to backend.
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token); // Save token to sessionStorage
        navigate('/home'); // Redirect to home page on successful login using navigate
      }
    } catch (error) {
      console.error(error);
      alert('Invalid login credentials');
    }
  };
  // Component that is displayed : 
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
