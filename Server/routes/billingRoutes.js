const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { authenticateUser } = require("../utils/middlewares");

router.get("/plans", billingController.getPlans);
router.post("/checkout", authenticateUser, billingController.createCheckout);
router.post("/verify", authenticateUser, billingController.verifyPayment);

module.exports = router;

