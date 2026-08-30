import { Router } from "express";
import { authenticateUser } from "../utils/middlewares";
import { createSubscriptionCheckout } from "../controllers/subscriptionController";
const router = Router({});

router.post("/checkout", authenticateUser, createSubscriptionCheckout);

export default router;
