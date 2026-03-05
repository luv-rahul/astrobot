const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { userAuth } = require("../middleware/userAuth");

router.get("/profile", userAuth, userController.getProfile);
router.patch("/profile", userAuth, userController.updateProfile);

module.exports = router;
