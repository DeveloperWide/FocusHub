const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({
      message: "User Already Exist"
    });

    let user = new User({ name, email, password });
    let svdUser = await user.save();
    console.log(svdUser)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User created successfully", token, user: {
        id: svdUser._id,
        name: svdUser.name,
        email: svdUser.email,
        profileImage: svdUser.profileImage
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

exports.login = async (req, res) => {
  console.log(req.body)
  try {
    
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    console.log(req.body, user)
    if (!user) return res.status(400).json({
      message: "Invalid credentials"
    });

    let isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) return res.status(400).json({
      message: "Invalid credentials"
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "User Successfully login",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    })

  } catch (er) {
    res.status(500).json({
      message: "Server Error Occurred"
    })
  }
}