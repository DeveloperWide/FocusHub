const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goalController");

// Get All Goals
router.get("/", goalController.getGoals);

// Create New Goal
router.post("/", goalController.createGoal);

// Delete Goal
router.delete("/:id", goalController.deleteGoal);

module.exports = router;
