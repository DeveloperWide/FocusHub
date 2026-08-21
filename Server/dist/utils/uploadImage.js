"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../cloudinary"));
const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({
            folder: "products",
        }, (error, result) => {
            if (error)
                reject(error);
            resolve(result);
        });
        stream_1.Readable.from(buffer).pipe(stream);
    });
};
exports.uploadImage = uploadImage;
