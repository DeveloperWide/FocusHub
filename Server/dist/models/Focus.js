"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const focusSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    task: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Task",
        default: null,
    },
    focusDuration: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id; // convert _id -> id
            delete ret._id; // remove _id
            delete ret.__v; // remove version key
            return ret;
        },
    },
});
const Focus = (0, mongoose_1.model)("Focus", focusSchema);
exports.default = Focus;
