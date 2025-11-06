const passport = require("passport");
const userRouter = require("express").Router();
const validateBody = require("../../middleware/validateBody");
const userController = require("./user.controller");
const { registerSchema, loginSchema } = require("./validator");
const jwt = require("jsonwebtoken");

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
    // ✅ GENERATE TOKEN
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ ADD THIS REDIRECT - THIS IS WHAT'S MISSING!
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

//route to list all the registered users
userRouter.get("/list-all", userController.getAll);

//route to edit/update the users
userRouter.put("/:id", userController.updateUser);

//route to delete users by id
userRouter.delete("/:id", userController.delete);

module.exports = userRouter;
