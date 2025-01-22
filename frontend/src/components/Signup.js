import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/auth'; // Can be replaced with actual backend URL after hosting.

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { username, email, password, role }; // Include email
      const response = await axios.post(`${API_URL}/signup`, userData, { withCredentials: true });

      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        navigate('/home'); // Redirect to home page after successful signup
      }
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="flex h-auto min-h-screen w-screen items-center justify-center bg-black">
    <div className="card-wrapper h-auto w-full max-w-sm sm:h-[570px] sm:w-[420px] p-44 pt-52 sm:p-12">
      <div className="card-content flex items-center justify-center text-xs w-full">
        <div className="bg-black p-6 w-full h-auto sm:h-[550px] rounded-3xl shadow-lg">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-300 mb-4 sm:mb-6">
            Signup
          </h2>
  
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-4 sm:px-4 sm:py-6 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400">
                <i className="fas fa-user"></i>
              </span>
            </div>
  
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-4 sm:px-4 sm:py-6 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
  
            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-4 sm:px-4 sm:py-6 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400">
                <i className="fas fa-lock"></i>
              </span>
            </div>
  
            {/* Role Selector */}
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-4 sm:px-4 sm:py-6 bg-black text-white border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              >
                <option value="user" className="bg-black text-white">User</option>
                <option value="contentCreator" className="bg-black text-white">Content Creator</option>
              </select>
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-4 text-base sm:text-lg text-white font-bold rounded border-2 border-yellow-300 hover:opacity-90 shadow-lg"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Signup;
