import { NextFunction, Request, Response } from "express";
import ExpressError from "./ExpressError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ExpressError) {
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
