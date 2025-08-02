const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";

exports.signup = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email: email });
    console.log(existingUser)
    if (existingUser) return res.status(400).json({
      message: "User Already Exist"
    });

    let user = new User({ name, email, password });
    let svdUser = await user.save();
    console.log(svdUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}