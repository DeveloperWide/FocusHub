const express = require("express");
const Task = require("../models/Task")
const router = express.Router();

// Get all Tasks
router.get("/", async (req, res) => {
    try {
        const allTasks = await Task.find();
        res.json({
            success: true,
            message: "All Your tasks here...",
            data: allTasks
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Server Error Occurred"
        })
    }
});

// Create Task
router.post("/", async (req, res) => {
    let inProgress;
    console.log(req.body);

    if (req.body.status === "todo") {
        inProgress = 0
    } else if (req.body.status === "in_Progress") {
        inProgress = 50
    } else {
        inProgress = 100;
    }

    try {
        const newTask = new Task({
            ...req.body,
            inProgress
        });
        const svdTask = await newTask.save();
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: svdTask
        });

    } catch (err) {
        console.log(err);
    }
});

// Get Task
router.get("/:id", async (req, res) => {
    let task = await Task.findById(req.params.id);
    res.json({
        success: true,
        message: "Your Task",
        data: task
    })
})

// Update task
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { inProgress } = req.body;

    let status;
    if (inProgress === 0) {
        status = "todo";
    } else if (inProgress === 100) {
        status = "done";
    } else {
        status = "in_Progress";
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { ...req.body, status }, { new: true });
        res.json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
});

// Update Complete Task 
router.put("/:id" , async (req ,res) => {
    let {id} = req.params;
    const task = await Task.findById(id);
    console.log(task);
    console.log(req.body)
})

module.exports = router;