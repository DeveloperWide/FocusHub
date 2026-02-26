const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";

exports.signup = wrapAsync(async (req, res, next) => {
  const { email, password, repeatPassword } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ExpressError(400, "User Already Exists");

  if (password !== repeatPassword) {
    return res.status(400).json({
      message: "Password & RepeatPassword Doesn't Match",
    });
  }

  let user = new User({ email, password });
  let svdUser = await user.save();
  if (!svdUser) throw new ExpressError(500, "failed To Save User");
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    message: `User created successfully`,
    token,
    user: {
      id: svdUser._id,
      email: svdUser.email,
    },
  });
});

exports.login = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) throw new ExpressError(400, "Invalid credentials");

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ExpressError(400, "Invalid credentials");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({
    message: `Successfully logged in.`,
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  });
});
