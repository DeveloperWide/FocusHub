import { Router } from "express";
import { authenticateUser } from "../utils/middlewares";
const router = Router();

import {
  getLast7DaysStats,
  getByGoalStats,
  getFocusTimers,
  createFocusTimer,
  updateFocusTimer,
  deleteFocusTimer,
} from "../controllers/focusTimerController";

// Stats
router.get("/stats/last-7-days", authenticateUser, getLast7DaysStats);

router.get("/stats/by-goal", authenticateUser, getByGoalStats);

// Get Focus Timers (production endpoint)
router.get("/timers", authenticateUser, getFocusTimers);

// Backwards-compatible endpoint (used in Time page components)
router.get("/focus-tasks", authenticateUser, getFocusTimers);

// Create Focus Timer (production endpoint)
router.post("/timers", authenticateUser, createFocusTimer);

// Edit/Delete Focus Timer
router.patch("/timers/:id", authenticateUser, updateFocusTimer);
router.delete("/timers/:id", authenticateUser, deleteFocusTimer);

// Backwards-compatible create endpoint
router.post("/", authenticateUser, createFocusTimer);

export default router;
