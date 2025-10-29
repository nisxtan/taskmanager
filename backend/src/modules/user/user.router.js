const userRouter = require("express").Router();
const validateBody = require("../../middleware/validateBody");
const userController = require("./user.controller");
const { registerSchema, loginSchema } = require("./validator");

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
