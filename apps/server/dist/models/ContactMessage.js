"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactMessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
}, { timestamps: true });
contactMessageSchema.index({ createdAt: -1 });
const ContactMessage = (0, mongoose_1.model)("ContactMessage", contactMessageSchema);
exports.default = ContactMessage;
