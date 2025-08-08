const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";

module.exports.authenticateUser = (req, res, next) => {
  console.log("Middleware: Authenticating user...");
  console.log("Request Headers:", req.headers);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication failed: No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Attach decoded user info to req.user
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed: Invalid or expired token." });
  }
};
