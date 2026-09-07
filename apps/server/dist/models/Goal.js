"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const goalSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    // Add Completed, Giveup  & days field
    tag: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
goalSchema.index({ user: 1, tag: 1 }, { unique: true });
const Goal = (0, mongoose_1.model)("Goal", goalSchema);
exports.default = Goal;
