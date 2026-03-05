const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/userAuth");
const chatController = require("../controller/chatController");

router.post("/chat", userAuth, chatController.searchQuery);

module.exports = router;