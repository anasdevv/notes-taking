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
    res.status(201).json({
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

const editUserInfo = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.profilePicture || user.pic;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    const token = createToken(updatedUser._id);
    res.status(200).json({
      email: updatedUser.email,
      name: updatedUser.name,
      pic: updatedUser.pic,
      token,
    });
  } else {
    res.status(404).json({ error: "user not found" });
  }
};

module.exports = { loginUser, signupUser, editUserInfo };
