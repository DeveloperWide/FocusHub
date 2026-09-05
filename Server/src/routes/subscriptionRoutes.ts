import { Router } from "express";
import { authenticateUser } from "../utils/middlewares";
import {
  createSubscriptionCheckout,
  razorpayWebhook,
  verifySubscription,
} from "../controllers/subscriptionController";
const router = Router({});

router.post("/checkout", authenticateUser, createSubscriptionCheckout);
router.post("/verify", authenticateUser, verifySubscription);
router.post("/webhook", razorpayWebhook);

export default router;
