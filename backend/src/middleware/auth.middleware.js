// import { verifyToken } from "../utils/jwt";
const { verifyToken } = require("../utils/jwt");
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

    //add the details in req.user so that it is available to other requests
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      isAdmin: decoded.isAdmin || false,
      permissions: decoded.permissions || [],
      role: decoded.role || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
