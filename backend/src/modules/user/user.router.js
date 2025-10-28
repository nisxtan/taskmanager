const userRouter = require("express").Router();
const userController = require("./user.controller");

userRouter.post("/register", userController.register);
module.exports = userRouter;
