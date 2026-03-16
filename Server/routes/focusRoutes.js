const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../utils/middlewares");
const focusTimerController = require("../controllers/focusTimerController");

// Stats
router.get(
  "/stats/last-7-days",
  authenticateUser,
  focusTimerController.getLast7DaysStats,
);

router.get(
  "/stats/by-goal",
  authenticateUser,
  focusTimerController.getByGoalStats,
);

// Get Focus Timers (production endpoint)
router.get("/timers", authenticateUser, focusTimerController.getFocusTimers);

// Backwards-compatible endpoint (used in Time page components)
router.get(
  "/focus-tasks",
  authenticateUser,
  focusTimerController.getFocusTimers,
);

// Create Focus Timer (production endpoint)
router.post("/timers", authenticateUser, focusTimerController.createFocusTimer);

// Edit/Delete Focus Timer
router.patch(
  "/timers/:id",
  authenticateUser,
  focusTimerController.updateFocusTimer,
);
router.delete(
  "/timers/:id",
  authenticateUser,
  focusTimerController.deleteFocusTimer,
);

// Backwards-compatible create endpoint
router.post("/", authenticateUser, focusTimerController.createFocusTimer);

module.exports = router;
