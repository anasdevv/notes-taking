const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../logger");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    logger.info(`${_id} Authorized`);

    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    logger.error("Request is not authorized");
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
