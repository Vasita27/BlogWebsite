import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import "./Login.css"
const API_URL = 'https://blogwebsite-3-0tyc.onrender.com/auth'; // Actual backend route will be replaced after hosting.

const Login = () => {
  // states for management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { username, password };
      const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true }); // Send the data to backend.
     
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token); // Save token to sessionStorage
        navigate('/home'); // Redirect to home page on successful login using navigate
      }
    } catch (error) {
      console.error(error);
      alert('Invalid login credentials');
    }
  };

  // Component that is displayed: 
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <div className="card-wrapper h-[470px] w-[420px] sm:w-[350px] md:w-[400px]">
        <div className="card-content flex items-center justify-center text-xs">
          <div className="bg-black p-6 h-[450px] w-full md:w-[400px] rounded-3xl shadow-lg">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-green-300 mb-6">Login</h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="relative">
                <input
                  type="text"
                  value={username}  
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-6 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400">
                  <i className="fas fa-user"></i>
                </span>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400">
                  <i className="fas fa-lock"></i>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 text-lg text-white font-bold  rounded border-2 border-yellow-300 hover:opacity-90 shadow-lg"
              >
                LOGIN
              </button>
            </form>

            {/* Links for Forgot Password and Register */}
            <div className="flex justify-between text-sm text-blue-300 mt-16">
              <a href="/forgotpassword" className="hover:underline">
                Forgot Password?
              </a>
              <a href="/signup" className="hover:underline">
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
