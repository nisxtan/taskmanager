const passport = require("passport");
const userRouter = require("express").Router();
const validateBody = require("../../middleware/validateBody");
const userController = require("./user.controller");
const { registerSchema, loginSchema } = require("./validator");
const jwt = require("jsonwebtoken");
const adminAuth = require("../../middleware/adminAuth");
const authMiddleware = require("../../middleware/auth.middleware");

console.log("🔍 USER ROUTER LOADED");

// Google OAuth routes
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);

// Register route
userRouter.post(
  "/register",
  validateBody(registerSchema),
  userController.register
);

// Login route
userRouter.post("/login", validateBody(loginSchema), userController.login);

// Admin login route
userRouter.post(
  "/admin/login",
  validateBody(loginSchema),
  userController.adminLogin
);

// Admin dashboard routes
userRouter.get("/admin/dashboard", adminAuth, userController.getAdminDashboard);

// ✅ ALL SPECIFIC /admin/* ROUTES FIRST
// Get all users with their roles
userRouter.get("/admin/users-with-roles", userController.getAllUsersWithRoles);

// Get all roles with permissions
userRouter.get("/admin/roles", userController.getAllRoles);

// Get all permissions
userRouter.get("/admin/permissions", userController.getAllPermissions);

// Assign role to user
userRouter.put("/admin/users/:id/assign-role", userController.assignRoleToUser);

// Remove role from user
userRouter.put(
  "/admin/users/:id/remove-role",
  userController.removeRoleFromUser
);

// Role CRUD routes
userRouter.post(
  "/admin/roles",
  authMiddleware,
  adminAuth,
  userController.createRole
);
userRouter.put(
  "/admin/roles/:id",
  authMiddleware,
  adminAuth,
  userController.updateRole
);
userRouter.delete(
  "/admin/roles/:id",
  authMiddleware,
  adminAuth,
  userController.deleteRole
);

// Permission CRUD routes
userRouter.post(
  "/admin/permissions",
  authMiddleware,
  adminAuth,
  userController.createPermission
);
userRouter.put(
  "/admin/permissions/:id",
  authMiddleware,
  adminAuth,
  userController.updatePermission
);
userRouter.delete(
  "/admin/permissions/:id",
  authMiddleware,
  adminAuth,
  userController.deletePermission
);

// Role-Permission management
userRouter.put(
  "/admin/roles/:id/permissions",
  authMiddleware,
  adminAuth,
  userController.assignPermissionsToRole
);

// ✅ GENERIC ROUTES LAST (these will match anything with /:id)
// Route to list all the registered users
userRouter.get("/list-all", userController.getAll);

// Route to edit/update the users
userRouter.put("/:id", userController.updateUser);

// Route to delete users by id
userRouter.delete("/:id", userController.delete);

// console.log("🔍 All user routes registered:");
// userRouter.stack.forEach((r) => {
//   if (r.route) {
//     console.log(
//       `  ${Object.keys(r.route.methods)[0].toUpperCase()} /user${r.route.path}`
//     );
//   }
// });

module.exports = userRouter;
