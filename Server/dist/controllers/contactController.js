"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactMessage = void 0;
const ContactMessage_1 = __importDefault(require("../models/ContactMessage"));
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value) => String(value ?? "").trim();
exports.createContactMessage = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    const name = clean(req.body?.name);
    const email = clean(req.body?.email).toLowerCase();
    const subject = clean(req.body?.subject);
    const message = clean(req.body?.message);
    if (!name || !email || !subject || !message) {
        throw ExpressError_1.default.badRequest("Name, email, subject, and message are required.");
    }
    if (!emailPattern.test(email)) {
        throw ExpressError_1.default.badRequest("Please provide a valid email address.");
    }
    const contactMessage = await ContactMessage_1.default.create({
        name,
        email,
        subject,
        message,
    });
    res.status(201).json({
        success: true,
        message: "Your message has been received.",
        data: { id: contactMessage.id },
    });
});
