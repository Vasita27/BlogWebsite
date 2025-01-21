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
    console.log("hi")
    try {
      const userData = { username, password, role }; // Include the selected role
      const response = await axios.post(`${API_URL}/signup`, userData,{ withCredentials: true }); //Send the data to backend
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
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black">
    <div className="card-wrapper h-[470px] w-[420px]">
      <div className="card-content flex items-center justify-center text-xs">
      <div className='bg-black p-6 h-[450px] w-[400px] rounded-3xl shadow-lg'>
       <h2 className='text-3xl font-bold text-center text-green-300 mb-6'>Signup</h2>
       <form onSubmit={handleSubmit}>
         <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-4 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"

        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-6 bg-transparent text-blue-300 border-b border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)} 
          className="w-full px-4 py-6 mt-2 bg-black text-white   border-b border-blue-500 focus:outline-none  focus:ring-blue-500 placeholder-gray-400"

        >
          <option value="user">User</option>
          <option value="contentCreator">Content Creator</option>
        </select>
              <button type="submit"
              className="w-full py-6 mt-4 text-lg text-white font-bold  rounded border-2 border-yellow-300 hover:opacity-90 shadow-lg"
              >Signup</button>
      </form>
    </div>
      </div>
      </div>
    </div>
  );
};

export default Signup;
