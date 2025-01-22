import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css"
const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://blogwebsite-2-7quo.onrender.com/app/getBlog/${id}`, {
          withCredentials: true
        });
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-gray-300 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-6 flex justify-center items-start">
  <div className="max-w-3xl w-full bg-black rounded-lg shadow-lg border border-gray-700 overflow-hidden">
    <div className="p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4" style={{ textAlign: "center"}}>{blog.title}</h1>

      {/* Author */}
      <p className="text-gray-400 mb-6" style={{ textAlign: "center"}}>By {blog.author}</p>

      {/* Images */}
      <div className="blog-image mb-6">
        {blog.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Blog ${index}`}
            className="rounded-lg w-full object-cover mb-4"
            height="200px"
          />
        ))}
      </div>

      {/* Blog Content */}
      <div className="text-gray-300 mb-8" style={{ textAlign: "center"}}>
        <p className="leading-relaxed whitespace-pre-wrap">{blog.content}</p>
      </div>

      {/* Categories and Tags */}
      <div className="border-t border-gray-700 pt-4 text-gray-500" style={{ textAlign: "center"}}>
        {/* Categories */}
        <p className="mb-2">
          Categories:{" "}
          <span className="text-teal-400">{blog.categories.join(", ")}</span>
        </p>

        {/* Tags */}
        <p>
          Tags:{" "}
          <span className="text-teal-400" style={{ textAlign: "center"}}>
            {blog.tags.map((tag) => `#${tag}`).join(", ")}
          </span>
        </p>
      </div>
    </div>
  </div>
</div>
  );
};

export default BlogDetail;