import { Router } from "express";
import { authenticateUser } from "../utils/middlewares";
import {
  createSubscriptionCheckout,
  verifySubscription,
} from "../controllers/subscriptionController";
const router = Router({});

router.post("/checkout", authenticateUser, createSubscriptionCheckout);
router.post("/verify", authenticateUser, verifySubscription);

export default router;
