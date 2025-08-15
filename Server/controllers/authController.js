const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";

exports.signup = wrapAsync(
  async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log(req.body)

    const existingUser = await User.findOne({ email })
    if (existingUser) throw new ExpressError(400, "User Already Exists")

    let user = new User({ name, email, password });
    let svdUser = await user.save();
    if(!svdUser) throw new ExpressError(500, "failed To Save User")
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: `User created successfully`,
      token,
      user: {
        id: svdUser._id,
        name: svdUser.name,
        email: svdUser.email,
        profileImage: svdUser.profileImage
      }
    });
  }
)

exports.login = wrapAsync(
  async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) throw new ExpressError(400, "Invalid credentials")

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ExpressError(400, "Invalid credentials")

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: `${user.name} Successfully login`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    })
  }
)