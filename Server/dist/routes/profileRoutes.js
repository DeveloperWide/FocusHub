"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const router = (0, express_1.Router)();
const upload_1 = __importDefault(require("../middleware/upload"));
const middlewares_1 = require("../utils/middlewares");
router.put("/update", middlewares_1.authenticateUser, upload_1.default.single("profileImage"), profileController_1.updateProfile);
router.delete("/me", middlewares_1.authenticateUser, profileController_1.deleteMe);
exports.default = router;
