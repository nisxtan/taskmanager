const { resolveContent } = require("nodemailer/lib/shared");
const { where } = require("sequelize");

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      //user must be authenticated

      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const AppDataSource = req.app.get("AppDataSource");
      const userRepository = AppDataSource.getRepository("User");

      //get user with role and permission
      const user = await userRepository.findOne({
        where: { id: req.user.id },
        relations: ["role", "role.permissions"],
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //admin has all permissions
      if (user.isAdmin) {
        return next();
      }

      //check if user has the required permission
      if (user.role && user.role.permissions) {
        const hasPermission = user.role.permissions.some(
          (permission) => permission.name === permissionName
        );
        if (hasPermission) {
          return next();
        }
      }

      // no permission
      return res.status(403).json({
        message: `Permission denied: ${permissionName} required`,
      });
    } catch (error) {
      console.log("Permission check error", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
};

module.exports = checkPermission;
