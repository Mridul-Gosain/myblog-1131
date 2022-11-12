const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const adminController = require("../controllers/admin");

router.get("/", userController.home);
router.get("/login", userController.loginView);
router.post("/login", userController.login);
router.get("/register", userController.registerView);
router.post("/register", userController.register);
router.get("/article/:id", userController.article);
router.get("/user/dashboard", userController.dashboard);
router.get("/user/posts", userController.posts);
router.get("/user/newpost", userController.newpostView);
router.post("/user/newpost", userController.savePost);
router.get("/deletePost", userController.deletePost);
router.get("/editPost", userController.editPostView);
router.post("/editPost", userController.updatePost);
router.get("/logout", userController.logout);
router.get("/category/:category", userController.category);
router.get("/init", userController.init);

router.get("/admin/dashboard", adminController.dashboard);
router.get("/admin/posts", adminController.posts);
router.get("/admin/users", adminController.users);

module.exports = router;
