import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://blogwebsite-2-7quo.onrender.com/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: Unable to process request');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <div className="h-[300px] w-[400px]">
        <div className="bg-black p-6 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-green-300 mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button type="submit" className="w-full py-2 text-lg text-white font-bold border-2 border-yellow-300 hover:opacity-90 shadow-lg">
              Reset Password
            </button>
          </form>
          {message && <p className="text-center text-blue-300 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 