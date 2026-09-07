"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../utils/middlewares");
const router = (0, express_1.Router)();
const focusTimerController_1 = require("../controllers/focusTimerController");
// Stats
router.get("/stats/last-7-days", middlewares_1.authenticateUser, focusTimerController_1.getLast7DaysStats);
router.get("/stats/by-goal", middlewares_1.authenticateUser, focusTimerController_1.getByGoalStats);
// Get Focus Timers (production endpoint)
router.get("/timers", middlewares_1.authenticateUser, focusTimerController_1.getFocusTimers);
// Backwards-compatible endpoint (used in Time page components)
router.get("/focus-tasks", middlewares_1.authenticateUser, focusTimerController_1.getFocusTimers);
// Create Focus Timer (production endpoint)
router.post("/timers", middlewares_1.authenticateUser, focusTimerController_1.createFocusTimer);
// Edit/Delete Focus Timer
router.patch("/timers/:id", middlewares_1.authenticateUser, focusTimerController_1.updateFocusTimer);
router.delete("/timers/:id", middlewares_1.authenticateUser, focusTimerController_1.deleteFocusTimer);
// Backwards-compatible create endpoint
router.post("/", middlewares_1.authenticateUser, focusTimerController_1.createFocusTimer);
exports.default = router;
