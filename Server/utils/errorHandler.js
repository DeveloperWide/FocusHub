module.exports = (err, req, res, next) => {
  // Mongo duplicate key
  if (err?.code === 11000) {
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

  const { message = "Some Error Occurred", status = 500 } = err;
  return res.status(status).json({
    success: false,
    message,
  });
};
