const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full Name is required"],
      minlength: [4, "Full Name must be at least 4 characters"],
      maxlength: [25, "Full Name cannot exceed 25 characters"],
    },
    emailId: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      },
    },
    dob: {
      type: String,
      required: [true, "Date of Birth is required"],
      validate: {
        validator: (value) =>
          validator.isDate(value, { format: "DD/MM/YYYY", strictMode: true }),
        message: "Date of Birth must be in DD/MM/YYYY format",
      },
    },
    birthTime: {
      type: String,
      required: [true, "Birth Time is required"],
      validate: {
        validator: (value) =>
          /^([1-9]|1[0-2]):[0-5][0-9]\s?(am|pm)$/i.test(value),
        message: "Birth Time must be in HH:MM am/pm format",
      },
    },
    birthPlace: {
      type: String,
      required: [true, "Birth Place is required"],
      minlength: [2, "Birth Place must be at least 2 characters"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
