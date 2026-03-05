const chatService = require("../services/chatService");

const searchQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const userData = ({ fullName, dob, birthTime, birthPlace } = req.user);
    const data = await chatService.handleGptSearchClick(userData, query);
    res.status(200).json({ status: 200, message: data });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Something went wrong!" });
  }
};

module.exports = { searchQuery };
