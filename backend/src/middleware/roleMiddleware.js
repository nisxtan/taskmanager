const { useReducer } = require("react");

const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const AppDataSource = req.app.get("AppDataSource");
      const userRepository = AppDataSource.getRepository("User");

      const user = userRepository.findOne({
        where: { id: req.user.id },
        relations: ["role"],
      });
      if (user.isAdmin) return next();

      if (user.role && user.role.name === roleName) {
        return next();
      }

      return res.status(403).json({
        message: `Role ${roleName} required`,
      });
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
};

module.exports = { requireRole };
