const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    categories: {
      type: [String], // Example: ["Technology", "Health"]
      required: true,
    },
    tags: {
      type: [String], // Example: ["React", "MongoDB", "Node"]
      default: [],
    },
    images: {
      type: [String], // Store URLs of uploaded images
      default: [],
    },
    views: {
      type: Number,
      default: 0, // Track blog views for "Trending" feature
    },
    likes: {
      type: [String],
      default: [], // Track likes for "Trending" feature
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema,"blogs");
