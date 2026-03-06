const authService = require("../services/authService");
const {
  isDataValid,
  isEmailValid,
  isPasswordValid,
} = require("../utils/validation");

const signup = async (req, res) => {
  try {
    const acceptedData = [
      "fullName",
      "emailId",
      "password",
      "dob",
      "birthTime",
      "birthPlace",
    ];
    const isAcceptedDataValid = Object.keys(req.body).every((key) =>
      acceptedData.includes(key),
    );

    if (!isAcceptedDataValid) {
      throw new Error("Invalid Credentials!");
    }

    const { fullName, emailId, password, dob, birthTime, birthPlace } =
      req.body;

    if (isDataValid(fullName, emailId, password, dob, birthTime, birthPlace)) {
      const { user, token } = await authService.signup({
        fullName,
        emailId,
        password,
        dob,
        birthTime,
        birthPlace,
      });

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res
        .status(200)
        .json({ status: 200, message: "User saved successfully!", user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong! " + err.message });
  }
};

const login = async (req, res) => {
  try {
    const acceptedData = ["emailId", "password"];
    const isAcceptedDataValid = Object.keys(req.body).every((key) =>
      acceptedData.includes(key),
    );

    if (!isAcceptedDataValid) {
      throw new Error("Invalid Credentials!");
    }

    const { emailId, password } = req.body;

    if (isEmailValid(emailId) && isPasswordValid(password)) {
      const { user, token } = await authService.login(emailId, password);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res
        .status(200)
        .json({ status: 200, message: "Login Successfully!", user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong! " + err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    res.status(200).json({ status: 200, message: "Logged out successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = { signup, login, logout };
