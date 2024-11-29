const express = require("express");

// controller functions
const userController = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// login route
router.post("/login", userController.loginUser);

// signup route
router.post("/signup", userController.signupUser);

// require auth for updating profile
router.use(requireAuth);

// update profile route
router.patch("/profile", userController.editUserInfo);

module.exports = router;
