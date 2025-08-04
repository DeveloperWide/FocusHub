const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "uploads/"})
const profileController = require("../controllers/profileController");

router.put("/update", upload.single('profileImage'), profileController.updateProfile);

module.exports = router;