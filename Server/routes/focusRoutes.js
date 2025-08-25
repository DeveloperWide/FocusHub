const express = require("express");
const Focus = require("../models/Focus");
const router = express.Router();

// Get Focus Sessions
router.get("/focus-tasks", async (req, res) => {
        const allFocusTasks = await Focus.find();
        res.json({
            success: true,
            message: "ALl Tasks",
            data : allFocusTasks
        })

})

// Store Focus Session in DB
router.post("/", async (req, res) => {
    console.log(`Req Body`, req.body)
    const focusTask = new Focus(req.body);
    const svdFocusTask = await focusTask.save();
    console.log(`Saved Focus Task`, svdFocusTask);
});


module.exports = router;