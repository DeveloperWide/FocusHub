import { Router } from "express";
const router = Router({});
import authController from "../controllers/authController";
import { authenticateUser } from "../utils/middlewares";

router.get("/u/check-username/:username", authController.checkUsername);
router.get("/u/suggest/:username", authController.suggestUsername);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authenticateUser, authController.me);
router.post("/logout", authController.logout);
// router.get("/u/:username");

export default router;
