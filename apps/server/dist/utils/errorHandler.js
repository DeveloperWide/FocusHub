"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ExpressError_1 = __importDefault(require("./ExpressError"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof ExpressError_1.default) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }
    // Mongo duplicate key
    if ("code" in err && err.code == 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value",
        });
    }
    // Mongoose validation error
    if (err?.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: err.message || "Validation error",
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
