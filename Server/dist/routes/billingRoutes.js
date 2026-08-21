"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)({});
const billingController_1 = __importDefault(require("../controllers/billingController"));
const middlewares_1 = require("../utils/middlewares");
router.get("/plans", billingController_1.default.getPlans);
router.post("/checkout", middlewares_1.authenticateUser, billingController_1.default.createCheckout);
router.post("/verify", middlewares_1.authenticateUser, billingController_1.default.verifyPayment);
exports.default = router;
