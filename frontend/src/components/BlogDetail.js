import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/app/getBlog/${id}`, {
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
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-4 md:px-8 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-xl text-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">{blog.title}</h1>
          
          <div className="text-gray-400 mb-6 flex items-center">
            <span className="mr-2">By</span>
            <span className="font-medium text-gray-300">{blog.author}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8 w-full">
            {blog.images.map((image, index) => (
              <div key={index} className="relative w-64 h-48 overflow-hidden rounded-lg">
                <img
                  src={`http://localhost:5000${image}`}
                  alt={`Blog ${index + 1}`}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="mb-8 max-w-2xl">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-left">
              {blog.content}
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6 space-y-4 w-full">
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-gray-400">Categories:</span>
              {blog.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-gray-400">Tags:</span>
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;