"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goalController_1 = require("../controllers/goalController");
const middlewares_1 = require("../utils/middlewares");
const router = (0, express_1.Router)();
// Get All Goals
router.get("/", middlewares_1.authenticateUser, goalController_1.getGoals);
// Create New Goal
router.post("/", middlewares_1.authenticateUser, goalController_1.createGoal);
// Update Goal
router.put("/:id", middlewares_1.authenticateUser, goalController_1.updateGoal);
// Delete Goal
router.delete("/:id", middlewares_1.authenticateUser, goalController_1.deleteGoal);
exports.default = router;
