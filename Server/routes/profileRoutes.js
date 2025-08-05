const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const profileController = require("../controllers/profileController");
const { authenticateUser } = require("../utils/middlewares");

router.put("/update", authenticateUser, upload.single('profileImage'), profileController.updateProfile);

module.exports = router;