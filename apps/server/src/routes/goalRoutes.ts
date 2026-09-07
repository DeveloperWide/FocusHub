import { Router } from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController";
import { authenticateUser } from "../utils/middlewares";

const router = Router();

// Get All Goals
router.get("/", authenticateUser, getGoals);

// Create New Goal
router.post("/", authenticateUser, createGoal);

// Update Goal
router.put("/:id", authenticateUser, updateGoal);

// Delete Goal
router.delete("/:id", authenticateUser, deleteGoal);

export default router;
