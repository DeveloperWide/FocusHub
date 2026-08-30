"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
router.post("/", contactController_1.createContactMessage);
exports.default = router;
