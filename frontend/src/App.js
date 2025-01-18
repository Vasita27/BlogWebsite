import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components import
import Login from './components/Login';
import Signup from './components/Signup'; 
import HomePage from './components/HomePage'; 
import AddBlog from './components/addBlog'; 
import BlogDetail from './components/BlogDetail';
import ManageBlogs from './components/ManageBlogs';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes for public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/*Below routes have protection via a middleware so they can't be accessed without logging in*/}
        <Route
          path="/home"
          element={<HomePage />}
        />
        <Route
          path="/addblog"
          element={<AddBlog />
          }
        />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/manageblogs" element={<ManageBlogs />} />
        {/* All other routes which are not defined or valid, redirect to login page */}
        <Route path="*" element={<Login />} />

      </Routes>
    </Router>
  );
};

export default App;
