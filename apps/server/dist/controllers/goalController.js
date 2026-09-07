"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.createGoal = exports.getGoals = void 0;
const Goal_1 = __importDefault(require("../models/Goal"));
const Task_1 = __importDefault(require("../models/Task"));
const User_1 = __importDefault(require("../models/User"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
const billingPlans_1 = require("../utils/billingPlans");
exports.getGoals = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    let allGoals = await Goal_1.default.find({ user: req.user?.id });
    res.status(200).json({
        success: true,
        message: "All Your Goals Here",
        data: allGoals,
    });
});
exports.createGoal = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    const { title, tag } = req.body;
    const user = await User_1.default.findById(req.user?.id);
    if (!user)
        throw new ExpressError_1.default(404, "User Not Found");
    const planId = (0, billingPlans_1.getEffectivePlanId)(user);
    const entitlements = (0, billingPlans_1.getEntitlements)(planId);
    const goalsLimit = entitlements?.goals;
    const goals = await Goal_1.default.find({ user: req.user?.id });
    if (Number.isFinite(goalsLimit) && goals.length >= goalsLimit) {
        const plan = (0, billingPlans_1.getPlan)(planId);
        const planName = plan?.name || "your plan";
        throw new ExpressError_1.default(406, `Goal limit reached for ${planName}. Upgrade to add more goals.`);
    }
    if (!title || !tag) {
        return res.status(400).json({
            message: "All fields are Required",
        });
    }
    // Todo: Implement trim() in frontend
    const newGoal = new Goal_1.default({
        title: String(title).trim(),
        tag: String(tag).trim(),
        user: req.user?.id,
    });
    let svdGoal = await newGoal.save();
    if (!svdGoal)
        throw new ExpressError_1.default(500, "Failed To Create Goal");
    res.status(200).json({
        success: true,
        message: "Your Goal Saved",
        data: svdGoal,
    });
});
// Update Goal Controller
exports.updateGoal = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { title, tag } = req.body;
    if (!title || !tag) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    let updatedGoal = await Goal_1.default.findOneAndUpdate({ _id: id, user: req.user?.id }, { title: String(title).trim(), tag: String(tag).trim() }, { new: true });
    if (!updatedGoal) {
        return res.status(404).json({
            message: "Goal NOT Found",
        });
    }
    return res.status(200).json({
        message: "Goal Successfully Updated",
        updatedGoal,
    });
});
exports.deleteGoal = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    const goalToBeDeleted = await Goal_1.default.findOneAndDelete({
        _id: req.params.id,
        user: req.user?.id,
    });
    if (!goalToBeDeleted)
        throw new ExpressError_1.default(404, "Goal Not Found");
    await Task_1.default.deleteMany({ user: req.user?.id, goal: goalToBeDeleted._id });
    res.status(200).json({
        success: true,
        message: "Goal Deleted Successfully",
    });
});
