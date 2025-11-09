const passport = require("passport");
const userRouter = require("express").Router();
const validateBody = require("../../middleware/validateBody");
const userController = require("./user.controller");
const { registerSchema, loginSchema } = require("./validator");
const jwt = require("jsonwebtoken");
const adminAuth = require("../../middleware/adminAuth");

//?Google OAuth routes

//initialize the google sign in
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//
userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    //GENERATE TOKEN
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);

//register route
userRouter.post(
  "/register",
  validateBody(registerSchema),
  userController.register
);

//login route
userRouter.post("/login", validateBody(loginSchema), userController.login);

//! admin login route
userRouter.post(
  "/admin/login",
  validateBody(loginSchema),
  userController.adminLogin
);

//admin dashboard routes

userRouter.get("/admin/dashboard", adminAuth, userController.getAdminDashboard);
// userRouter.get("/admin/users", adminAuth, userController.getAllUsersForAdmin);
// userRouter.get('/admin')

//route to list all the registered users
userRouter.get("/list-all", userController.getAll);

//route to edit/update the users
userRouter.put("/:id", userController.updateUser);

//route to delete users by id
userRouter.delete("/:id", userController.delete);

//get all users with their roles
userRouter.get("/admin/users-with-roles", userController.getAllUsersWithRoles);

userRouter.get("/admin/roles", userController.getAllRoles);
// Get all permissions
userRouter.get("/admin/permissions", userController.getAllPermissions);

//assign role to user
userRouter.put("/admin/users/:id/assign-role", userController.assignRoleToUser);

//remove role from user
userRouter.put(
  "/admin/users/:id/remove-role",
  userController.removeRoleFromUser
);

module.exports = userRouter;
