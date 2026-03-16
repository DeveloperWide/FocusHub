const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "fh_session";
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
const SESSION_MAX_AGE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

const getCookieSecurityOptions = () => {
  const isProd = process.env.NODE_ENV === "production";

  const secure =
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "true"
      : isProd;

  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProd ? "none" : "lax");

  return { secure, sameSite };
};

const getAuthCookieOptions = () => {
  const { secure, sameSite } = getCookieSecurityOptions();

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  };
};

const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: `${SESSION_DAYS}d`,
  });

  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

const clearAuthCookie = (res) => {
  const { secure, sameSite } = getCookieSecurityOptions();
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  });
};

exports.checkUsername = wrapAsync(async (req, res, next) => {
  const username = req.params.username.toLowerCase();

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

  setAuthCookie(res, svdUser._id);

  res.status(201).json({
    message: `User created successfully`,
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

  setAuthCookie(res, user._id);

  res.status(200).json({
    message: `Successfully logged in.`,
    user,
  });
});

exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out" });
};

exports.me = wrapAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError(404, "User Not Found");

  res.status(200).json({ user });
});
