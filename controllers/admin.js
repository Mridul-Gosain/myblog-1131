const { urlencoded } = require("body-parser");
const { Op } = require("sequelize");
const userSchema = require("../models/User");
const db = require("../database");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

const dashboard = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else if (req.session.user.role !== "admin") {
    res.redirect("/user/dashboard");
  } else {
    res.render("admin/dashboard", { user: req.session.user });
  }
};

const posts = (req, res, next) => {
  res.render("admin/posts", { user: req.session.user });
};

const users = (req, res, next) => {
  res.render("admin/posts", { user: req.session.user });
};

module.exports = {
  dashboard,
  posts,
  users,
};
