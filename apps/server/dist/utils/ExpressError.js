"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpressError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ExpressError";
        this.status = status;
        // Maintains proper stack trace
        Error.captureStackTrace?.(this, ExpressError);
    }
    static badRequest(message) {
        return new ExpressError(400, message);
    }
    static unauthorized(message = "Unauthorized") {
        return new ExpressError(401, message);
    }
    static forbidden(message = "Forbidden") {
        return new ExpressError(403, message);
    }
    static notFound(message = "NOT FOUND") {
        return new ExpressError(404, message);
    }
    static conflict(message) {
        return new ExpressError(409, message);
    }
    static internal(message = "Internal Server Error") {
        return new ExpressError(500, message);
    }
}
exports.default = ExpressError;
