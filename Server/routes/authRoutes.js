const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/u/check-username/:username", authController.checkUsername);
router.get("/u/suggest/:username", authController.suggestUsername);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.get("/u/:username");

module.exports = router;
