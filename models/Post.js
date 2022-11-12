const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const User = require("../models/User");

const postSchema = new Schema({
  title: String,
  content: String,
  category: String,
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  date: String,
});

const Post = model("Post", postSchema);
module.exports = Post;
