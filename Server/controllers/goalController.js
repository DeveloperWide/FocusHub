const Goal = require("../models/Goal");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

module.exports.getGoals = wrapAsync(async (req, res, next) => {
    let allGoals = await Goal.find();

    res.status(200).json({
        success: true,
        message: "All Your Goals Here",
        data: allGoals
    })
})

module.exports.createGoal = wrapAsync(
    async (req, res, next) => {
        const allGoals = await Goal.find();
        if(allGoals.length === 3){
            throw new ExpressError(406, "Only 3 Goals Are Accepted")
        }

        const newGoal = new Goal(req.body);
        const svdGoal = await newGoal.save();
        if(!svdGoal) throw new ExpressError(500, "Failed To Create Goal")
        console.log(svdGoal);
        res.status(200).send({
            success: true,
            message: "Your Goal Saved",
            data: req.body
        })
    }
)

module.exports.deleteGoal = wrapAsync(
    async (req, res, next) => {
       const goalToBeDeleted = await Goal.findByIdAndDelete(req.params.id);
       if(!goalToBeDeleted) throw new ExpressError(404, "Goal Not Found")
        res.status(200).json({
            success: true,
            message: "Goal Deleted Successfully"
        })
    }
)