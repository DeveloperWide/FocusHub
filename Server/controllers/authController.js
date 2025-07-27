const User = require("../models/User.js");
const { generateToken } = require("../utils/generateToken.js");


module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  generateToken(res, user._id);
  res.json({ id: user._id, name: user.name, email: user.email });
};

module.exports.logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

// module.exports.getProfile = async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.json(user);
// };
