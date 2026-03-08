const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goalController");
const { authenticateUser } = require("../utils/middlewares");

// Get All Goals
router.get("/", authenticateUser, goalController.getGoals);

// Create New Goal
router.post("/", authenticateUser, goalController.createGoal);

// Delete Goal
router.delete("/:id", authenticateUser, goalController.deleteGoal);

module.exports = router;
