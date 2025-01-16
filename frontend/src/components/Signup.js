import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import axios from 'axios';

const API_URL = 'http://localhost:5000/auth'; // Can be replaced with actual backend url after hosting.

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { username, password, role }; // Include the selected role
      const response = await axios.post(`${API_URL}/signup`, userData); //Send the data to backend

      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token); // Save token to sessionStorage
        navigate('/home'); // Redirect to home page after successful signup using navigate
      }
    } catch (error) {
      alert('Signup failed');
    }
  };
  //Component that is returned
  return (
    <div>
      <h2>Signup</h2>
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)} // Update role based on selection
        >
          <option value="user">User</option>
          <option value="contentCreator">Content Creator</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
