const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);
    logger.info(`User logged in: ${email}`);

    res.status(201).json({
      email: user.email,
      name: user.name,
      profilePicture: user.pic,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    logger.error(`Login failed for ${email}: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  try {
    const user = await User.signup(name, email, password, profilePicture);

    // create a token
    const token = createToken(user._id);
    logger.info(`User signed up: ${email}`);

    res
      .status(201)
      .json({ email, name, profilePicture, createdAt: user.createdAt, token });
  } catch (error) {
    logger.error(`Signup failed for ${email}: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const editUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.pic = req.body.profilePicture || user.pic;

      if (req.body.password) {
        if (!validator.isStrongPassword(req.body.password)) {
          throw Error("Password is too weak");
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        user.password = hash;
      }

      const updatedUser = await user.save();

      const token = createToken(updatedUser._id);
      logger.info(`User info updated: ${user.email}`);

      res.status(200).json({
        email: updatedUser.email,
        name: updatedUser.name,
        profilePicture: updatedUser.pic,
        createdAt: updatedUser.createdAt,
        token,
      });
    } else {
      logger.warn(`User not found: ${req.user._id}`);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error(`Error updating user info: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser, editUserInfo };
