const express = require("express");
const Task = require("../models/Task")
const router = express.Router();

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

router.post("/", async (req, res) => {
    try{
        console.log(req.body)
    }catch(err){
        console.log(err);
    }
})

module.exports = router;