import { Router } from "express";
const router = Router({});
import {
  getPlans,
  createCheckout,
  verifyPayment,
} from "../controllers/billingController";
import { authenticateUser } from "../utils/middlewares";

router.get("/plans", getPlans);
router.post("/checkout", authenticateUser, createCheckout);
router.post("/verify", authenticateUser, verifyPayment);

export default router;
