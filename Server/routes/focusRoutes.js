const express = require("express");
const Focus = require("../models/Focus");
const router = express.Router();
const {authenticateUser} = require("../utils/middlewares");
const User = require("../models/User");

// Get Focus Sessions
router.get("/focus-tasks", authenticateUser, async (req, res) => {
        // const user = await User.findById(req.user)
        const allFocusTasks = await Focus.find({user: req.user.id});
        res.json({
            success: true,
            message: "ALl Tasks",
            data : allFocusTasks
        })
})

// Store Focus Session in DB
router.post("/", authenticateUser, async (req, res) => {
    const focusTask = new Focus({
        ...req.body,
        user: req.user.id
    });
    const svdFocusTask = await focusTask.save();
    console.log(`Saved Focus Task`, svdFocusTask);
});


module.exports = router;