import { Router } from "express";
const router = Router({});
import billingController from "../controllers/billingController";
import { authenticateUser } from "../utils/middlewares";

router.get("/plans", billingController.getPlans);
router.post("/checkout", authenticateUser, billingController.createCheckout);
router.post("/verify", authenticateUser, billingController.verifyPayment);

export default router;
