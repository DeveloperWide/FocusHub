const Goal = require("../models/Goal");

module.exports.getGoals = async (req, res) => {
    let allGoals = await Goal.find();
    res.status(200).json({
        success: true,
        message: "All Your Goals Here",
        data: allGoals
    })
}

module.exports.createGoal = async (req, res) => {
    try {
        const newGoal = new Goal(req.body);
        const svdGoal = await newGoal.save();
        console.log(svdGoal);
        res.status(200).send({
            success: true,
            message: "Your Goal Saved",
            data: req.body
        })
    } catch (er) {
        res.status(500).send({
            success: false,
            message: "Server Error Occurred",
        })
    }
}

module.exports.deleteGoal = async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Goal Deleted Successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        })
    }
}