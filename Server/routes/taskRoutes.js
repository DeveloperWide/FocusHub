const express = require("express");
const taskController = require("../controllers/taskController");
const router = express.Router();
const { authenticateUser } = require("../utils/middlewares");

// Get all Tasks
router.get("/", authenticateUser, taskController.getTasks);

// Create Task
router.post("/", authenticateUser, taskController.createTask);

// // Get Task
// router.get("/:id", authenticateUser, taskController.showTask);

// Update Complete Task
router.put("/:id", authenticateUser, taskController.updateTask);

// Toggle/Set Task Completion
router.patch("/:id/complete", authenticateUser, taskController.toggleTaskComplete);

// Delete Task
router.delete("/:id", authenticateUser, taskController.deleteTask);

module.exports = router;
