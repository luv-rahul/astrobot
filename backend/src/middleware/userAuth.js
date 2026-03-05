const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid Token or Token Expired!" });
    }

    const decode = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    const { _id } = decode;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User doesn't exist");
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized Access!" });
  }
};

module.exports = { userAuth };
