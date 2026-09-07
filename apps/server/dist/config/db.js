"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Connect to MongoDB
const connectDb = async () => {
    try {
        const db_Url = process.env.DB_URL;
        if (!db_Url) {
            throw new Error("db_URL is not defined in environment variable");
        }
        const conn = await mongoose_1.default.connect(db_Url);
        console.log("Mongo Connection : ", conn.connection.host);
    }
    catch (err) {
        console.log("Mongo Connection error : ", err);
        process.exit(1);
    }
};
exports.connectDb = connectDb;
