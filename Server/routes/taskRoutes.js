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
    try{
        const newTask = new Task(req.body);
        const svdTask = await newTask.save();
    }catch(err){
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

module.exports = router;