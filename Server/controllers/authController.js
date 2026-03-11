const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

const JWT_SECRET = process.env.JWT_SECRET;

exports.checkUsername = wrapAsync(async (req, res, next) => {
  const username = req.params.username.toLowerCase();
  console.log(req.params.username.toLowerCase());

  const user = await User.findOne({ username });

  if (user) {
    return res.json({
      available: false,
    });
  }

  return res.json({
    available: true,
  });
});

exports.suggestUsername = wrapAsync(async (req, res, next) => {
  const base = req.params.username.toLowerCase();

  const suggestions = [];

  for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * 9999);
    suggestions.push(`${base}_${random}`);
  }

  const availableSuggestions = [];

  for (let name of suggestions) {
    const exists = await User.findOne({ username: name });

    if (!exists) {
      availableSuggestions.push(name);
    }
  }

  res.json({
    suggestions: availableSuggestions,
  });
});

exports.signup = wrapAsync(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ExpressError(400, "User Already Exists");

  let user = new User({ name, username, email, password });
  let svdUser = await user.save();
  if (!svdUser) throw new ExpressError(500, "failed To Save User");
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    message: `User created successfully`,
    token,
    user: svdUser,
  });
});

exports.login = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  let user = await User.findOne({ email });
  if (!user) throw new ExpressError(400, "No User Found w/ This Email");

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ExpressError(400, "Invalid credentials");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({
    message: `Successfully logged in.`,
    token,
    user,
  });
});
