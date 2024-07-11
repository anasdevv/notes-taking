const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
    res
      .status(201)
      .json({
        email: user.email,
        name: user.name,
        profilePicture: user.pic,
        token,
      });
  } catch (error) {
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
    res.status(201).json({ email, name, profilePicture, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };