const express = require("express");
const Goal = require("../models/Goal");
const router = express.Router();


router.get("/" , async(req, res) => {
    let allGoals = await Goal.find();
    res.status(200).json({
        success: true,
        message: "All Your Goals Here",
        data: allGoals
    })
})

module.exports = router;