const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async ({
  fullName,
  emailId,
  password,
  dob,
  birthTime,
  birthPlace,
}) => {
  try {
    const isExistingUser = await User.findOne({ emailId: emailId });
    if (isExistingUser) {
      throw new Error("User already exists!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      emailId,
      password: passwordHash,
      dob,
      birthTime,
      birthPlace,
    });

    await user.save();

    const token = jwt.sign(
      { _id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "1h" },
    );

    return { user, token };
  } catch (err) {
    throw new Error("Signup Failed: " + err.message);
  }
};

const login = async (emailId, password) => {
  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid EmailId or Password");
    }

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid EmailId or Password");
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "1h" },
    );

    return { user, token };
  } catch (err) {
    throw new Error("Login Failed: " + err.message);
  }
};

module.exports = { signup, login };
