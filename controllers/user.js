const { urlencoded } = require("body-parser");
const { Op } = require("sequelize");
const userSchema = require("../models/User");
const db = require("../database");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

const home = (req, res, next) => {
  Post.find({})
    .sort({ _id: -1 })
    .populate("author")

    .lean()
    .then(function (posts) {
      res.render("home", { posts, user: req.session.user });
    });
};

const category = (req, res, next) => {
  Post.find({ category: req.params.category })
    .sort({ _id: -1 })
    .populate("author")

    .lean()
    .then(function (posts) {
      res.render("home", { posts });
    });
};

const loginView = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/user/dashboard");
  }
  res.render("login");
};

const login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let error = false;

  if (username == "") {
    error = true;
    req.flash("username_error", "Username field is required!");
  } else if (!/^[A-Za-z0-9 ]+$/.test(username)) {
    error = true;
    req.flash("username_error", "No special character allowed for username");
  }

  if (password == "") {
    error = true;
    req.flash("password_error", "Password field is required!");
  }

  if (error) {
    res.render("login", {
      username_error: req.flash("username_error"),
      password_error: req.flash("password_error"),
      username,
    });
  } else {
    User.findOne({ username: username }, "", function (err, user) {
      if (err) throw err;

      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (!result) {
            req.flash("incorrectpass", "Incorrect password!");

            res.render("login", {
              incorrectpass: req.flash("incorrectpass"),
              username: "",
            });
          } else {
            req.session.user = user;

            if (user.role === "admin") {
              res.redirect("/admin/dashboard");
            } else {
              res.redirect("/user/dashboard");
            }
          }
        });
      } else {
        req.flash("usernotfound", "User not found!");

        res.render("login", {
          usernotfound: req.flash("usernotfound"),
          username: "",
        });
      }
    });
  }
};

const registerView = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/user/dashboard");
  }
  res.render("register");
};

const register = async (req, res, next) => {
  let first_name = req.body.first_name.trim();
  let last_name = req.body.last_name.trim();
  let email = req.body.email.trim();
  let phone_number = req.body.phone_number.trim();
  let company_name = req.body.company_name.trim();
  let street_address = req.body.street_address.trim();
  let street_address2 = req.body.street_address2.trim();
  let city = req.body.city.trim();
  let postcode = req.body.postcode.trim();
  let country = req.body.country.trim();
  let tax_id = req.body.tax_id.trim();
  let username = req.body.username.trim();
  let password = req.body.password.trim();
  let confirm_password = req.body.confirm_password.trim();
  let error = false;

  if (first_name == "") {
    error = true;
    req.flash("first_name_error", "Firstname is required!");
  } else if (!/^[a-zA-Z ]*$/.test(first_name)) {
    error = true;
    req.flash("first_name_error", "No special character allowed in firstname!");
  } else if (first_name.length < 6) {
    error = true;
    req.flash("first_name_error", "Firstname should be 6 characters long!");
  } else if (first_name.length > 12) {
    error = true;
    req.flash("first_name_error", "Firstname should not exceed 12 characters!");
  }

  if (last_name == "") {
    error = true;
    req.flash("last_name_error", "Lastname is required!");
  } else if (!/^[a-zA-Z ]*$/.test(last_name)) {
    error = true;
    req.flash("last_name_error", "No special character allowed in lastname!");
  } else if (last_name.length < 6) {
    error = true;
    req.flash("last_name_error", "Lastname should be 6 characters long!");
  } else if (last_name.length > 12) {
    error = true;
    req.flash("last_name_error", "Lastname should be 12 characters long!");
  }

  if (email == "") {
    error = true;
    req.flash("email_error", "Email field is required!");
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    error = true;
    req.flash("email_error", "Enter email in proper format!");
  }

  if (phone_number == "") {
    error = true;
    req.flash("phone_error", "Phone number field is required!");
  } else if (!/^[0-9]*$/.test(phone_number)) {
    error = true;
    req.flash("phone_error", "Only letters allowed for phone number!");
  }

  if (company_name != "" && !/^[a-zA-Z ]*$/.test(company_name)) {
    error = true;
    req.flash("company_name_error", "Only letters allowed for company name!");
  } else if (company_name != "" && company_name.length < 6) {
    error = true;
    req.flash(
      "company_name_error",
      "Company name should be 6 characters long!"
    );
  } else if (company_name != "" && company_name.length > 12) {
    error = true;
    req.flash(
      "company_name_error",
      "Company name should not exceed 12 characters!"
    );
  }

  if (street_address == "") {
    error = true;
    req.flash("street_address_error", "Street address field is required!");
  } else if (street_address.length < 6) {
    error = true;
    req.flash(
      "street_address_error",
      "Street address should be 6 characters long!"
    );
  } else if (street_address.length > 100) {
    error = true;
    req.flash(
      "street_address_error",
      "Street address should not exceed 100 characters!"
    );
  }

  if (city == "") {
    error = true;
    req.flash("city_error", "City field is required!");
  } else if (!/^[a-zA-Z ]*$/.test(city)) {
    error = true;
    req.flash("city_error", "Only letters allowed for city name!");
  } else if (city.length < 6) {
    error = true;
    req.flash("city_error", "City name should be 6 characters long!");
  } else if (city.length > 12) {
    error = true;
    req.flash("city_error", "City name should not exceed 12 characters!");
  }

  if (postcode == "") {
    error = true;
    req.flash("postcode_error", "Postcode field is required!");
  } else if (!/^[0-9]*$/.test(postcode)) {
    error = true;
    req.flash("postcode_error", "Only numbers allowed for postcode field!");
  } else if (!/^.{5,}$/.test(postcode)) {
    error = true;
    req.flash("postcode_error", "Postcode should be 5 characters long!");
  }

  if (country == "") {
    error = true;
    req.flash("country_error", "Country field is required!");
  } else if (!/^[a-zA-Z]*$/.test(country)) {
    error = true;
    req.flash("country_error", "Only alphabets allowed for country!");
  } else if (country.length < 6) {
    error = true;
    req.flash("country_error", "Country name should be 6 characters long!");
  } else if (country.length > 12) {
    error = true;
    req.flash("country_error", "Country name should not exceed 12 characters!");
  }

  if (username == "") {
    error = true;
    req.flash("username_error", "Username field is required!");
  } else if (!/^[a-zA-Z]([._-]?[a-zA-Z0-9]+)*$/.test(username)) {
    error = true;
    req.flash("username_error", "Username must have letters and numbers");
  } else if (username.length < 6) {
    error = true;
    req.flash(
      "username_error",
      "Username should be more then 6 characters long!"
    );
  } else if (username.length > 12) {
    error = true;
    req.flash("username_error", "Username should not exceed 12 characters!");
  }

  if (password == "") {
    error = true;
    req.flash("password_error", "Password field is required!");
  } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(password)) {
    error = true;
    req.flash(
      "password_error",
      "Password should contain one letter and one number atleast!"
    );
  } else if (password.length < 6) {
    error = true;
    req.flash("password_error", "Password shoulbe be 6 characters long!");
  } else if (password.length > 12) {
    error = true;
    req.flash("password_error", "Password must not exceed 12 characters!");
  }

  if (confirm_password == "") {
    error = true;
    req.flash("confirm_password_error", "Confirm password field is required!");
  } else if (password != confirm_password) {
    error = true;
    req.flash("confirm_password_error", "Incorrect confirm password!");
  }

  if (error) {
    res.render("register", {
      first_name_error: req.flash("first_name_error"),
      last_name_error: req.flash("last_name_error"),
      email_error: req.flash("email_error"),
      phone_error: req.flash("phone_error"),
      company_name_error: req.flash("company_name_error"),
      street_address_error: req.flash("street_address_error"),
      city_error: req.flash("city_error"),
      postcode_error: req.flash("postcode_error"),
      country_error: req.flash("country_error"),
      password_error: req.flash("password_error"),
      confirm_password_error: req.flash("confirm_password_error"),
      username_error: req.flash("username_error"),
      form: {
        first_name,
        last_name,
        email,
        phone_number,
        company_name,
        street_address,
        street_address2,
        city,
        postcode,
        country,
        tax_id,
        username,
        password,
      },
    });
  } else {
    User.findOne({ email: email }).then(function (user) {
      if (user != null) {
        req.flash("email_used", "Email already in use!");
        res.render("register", {
          email_used: req.flash("email_used"),
          form: {
            first_name,
            last_name,
            email,
            phone_number,
            company_name,
            street_address,
            street_address2,
            city,
            postcode,
            country,
            tax_id,
            username,
            password,
          },
        });
      } else {
        User.findOne({ username: username }).then(function (user) {
          if (user != null) {
            req.flash("username_used", "Username already in use!");
            res.render("register", {
              username_used: req.flash("username_used"),
              form: {
                first_name,
                last_name,
                email,
                phone_number,
                company_name,
                street_address,
                street_address2,
                city,
                postcode,
                country,
                tax_id,
                username,
                password,
              },
            });
          } else {
            bcrypt.hash(password, 10, async function (err, hash) {
              if (err) throw err;

              let newuser = {
                first_name,
                last_name,
                email,
                phone_number,
                company_name,
                street_address,
                street_address2,
                city,
                postcode,
                country,
                tax_id,
                username,
                password: hash,
                role: "normal",
              };
              const user = new User(newuser);

              user.save().then(function (user) {
                req.session.user = user;

                res.redirect("user/dashboard");
              });
            });
          }
        });
      }
    });
  }

  // res.render("wellcome", { user: first_name + " " + last_name }); 123
};

const article = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate("author")
    .lean()
    .exec(function (err, post) {
      if (err) console.log(err);

      res.render("article", { post });
    });
};

const dashboard = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  }
  res.render("user/dashboard", { user: req.session.user });
};

const posts = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    Post.find({ author: req.session.user._id })
      .populate("author")
      .lean()
      .exec(function (err, posts) {
        if (err) console.log(err);

        res.render("user/posts", { posts });
      });
  }
};

const newpostView = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  }
  res.render("user/newpost", { user: req.session.user });
};

const savePost = (req, res, next) => {
  let newPost = {
    author: req.session.user._id,
    category: req.body.category,
    title: req.body.title,
    content: req.body.content,
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  let post = new Post(newPost);
  post.save().then(function () {
    res.redirect("/user/posts");
  });
};

const deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.query.id }).then(function () {
    res.redirect("/user/posts");
  });
};

const editPostView = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  }
  Post.findOne({ _id: req.query.id })
    .lean()
    .then(function (post) {
      res.render("user/editpost", { post });
    });
};

const updatePost = (req, res, next) => {
  let newdata = {
    title: req.body.title,
    category: req.body.category,
    content: req.body.content,
  };

  Post.findOneAndUpdate(
    { _id: req.body.id },
    newdata,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });

      res.redirect("/user/posts");
    }
  );
};

const logout = (req, res, next) => {
  req.session.user = null;

  res.redirect("/");
};

const init = (req, res, next) => {
  User.findOne({ username: "johndoe" }).then(function (user) {
    if (user == null) {
      let newuser = new User({
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@gmail.com",
        role: "admin",
        password:
          "$2b$10$K03qMZETmBclcNqbLxWnkexnQZhOuhbtAESZ7/XILnbs5li5IxAdW",
      });

      newuser.save().then(function () {
        res.redirect("/login");
      });
    } else {
      res.redirect("/login");
    }
  });
};

//export controller functions
module.exports = {
  home,
  loginView,
  login,
  registerView,
  register,
  article,
  dashboard,
  posts,
  newpostView,
  savePost,
  deletePost,
  editPostView,
  updatePost,
  logout,
  category,
  init,
};
