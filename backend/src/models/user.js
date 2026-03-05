const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    minLength: 4,
    maxLength: 20,
    trim: true,
    required: true,
  },
  emailId: {
    type: String,
    trim: true,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    minLength: 8,
    trim: true,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  birthTime: {
    type: String,
    required: true,
  },
  birthPlace: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
