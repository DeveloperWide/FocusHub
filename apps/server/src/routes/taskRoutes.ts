import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from "../controllers/taskController";
import { authenticateUser } from "../utils/middlewares";
const router = Router();

// Get all Tasks
router.get("/", authenticateUser, getTasks);

// Create Task
router.post("/", authenticateUser, createTask);

// // Get Task
// router.get("/:id", authenticateUser, showTask);

// Update Complete Task
router.put("/:id", authenticateUser, updateTask);

// Toggle/Set Task Completion
router.patch("/:id/complete", authenticateUser, toggleTaskComplete);

// Delete Task
router.delete("/:id", authenticateUser, deleteTask);

export default router;
