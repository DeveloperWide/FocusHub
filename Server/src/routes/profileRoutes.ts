import { Router } from "express";
import { deleteMe, updateProfile } from "../controllers/profileController";
const router = Router();
import upload from "../middleware/upload";
import { authenticateUser } from "../utils/middlewares";

router.put(
  "/update",
  authenticateUser,
  upload.single("profileImage"),
  updateProfile,
);

router.delete("/me", authenticateUser, deleteMe);

export default router;
