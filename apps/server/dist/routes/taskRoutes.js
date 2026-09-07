"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const middlewares_1 = require("../utils/middlewares");
const router = (0, express_1.Router)();
// Get all Tasks
router.get("/", middlewares_1.authenticateUser, taskController_1.getTasks);
// Create Task
router.post("/", middlewares_1.authenticateUser, taskController_1.createTask);
// // Get Task
// router.get("/:id", authenticateUser, showTask);
// Update Complete Task
router.put("/:id", middlewares_1.authenticateUser, taskController_1.updateTask);
// Toggle/Set Task Completion
router.patch("/:id/complete", middlewares_1.authenticateUser, taskController_1.toggleTaskComplete);
// Delete Task
router.delete("/:id", middlewares_1.authenticateUser, taskController_1.deleteTask);
exports.default = router;
