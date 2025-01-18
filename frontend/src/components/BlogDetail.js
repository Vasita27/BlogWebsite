import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    // Fetch the full blog post using the ID
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/app/getBlog/${id}`,{withCredentials:true}); // Adjust the endpoint as needed
      
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-detail">
      <h1>{blog.title}</h1>
      <p>By {blog.author}</p>
      <div className="blog-image">
        {blog.images.map((image, index) => (
          <img key={index} src={`http://localhost:5000${image}`} alt={`Blog ${index}`} height="100px"/>
        ))}
      </div>
      <p>{blog.content}</p>
      <div className="blog-meta">
        <p>Categories: {blog.categories.join(", ")}</p>
        <p>Tags: {blog.tags.join(", ")}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
