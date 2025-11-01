// import { verifyToken } from "../utils/jwt";
const verifyToken = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
  try {
    //get token from auth header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied, no token.",
      });
    }

    //extract token
    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.uses = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
