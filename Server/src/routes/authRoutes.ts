import { Router } from "express";
const router = Router({});
import {
  checkUsername,
  suggestUsername,
  signup,
  login,
  me,
  logout,
} from "../controllers/authController";
import { authenticateUser } from "../utils/middlewares";

router.get("/u/check-username/:username", checkUsername);
router.get("/u/suggest/:username", suggestUsername);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateUser, me);
router.post("/logout", logout);
// router.get("/u/:username");

export default router;
