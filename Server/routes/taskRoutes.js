const express = require("express");
const taskController = require("../controllers/taskController")
const router = express.Router();
const { authenticateUser } = require("../utils/middlewares");

// Get all Tasks
router.get("/", taskController.getTasks);

// Create Task
router.post("/", authenticateUser ,taskController.createTask);

// Get Task
router.get("/:id", taskController.showTask)

// Update task
router.patch("/:id", taskController.updateTask);

// Update Complete Task 
router.put("/:id", taskController.updateTaskInProgress)

router.delete("/:id", taskController.deleteTask)

module.exports = router;