const router = require("express").Router();
const taskRouter = require("../modules/task/task.router");
const userRouter = require("../modules/user/user.router");

router.use("/user", userRouter);

router.use("/task", taskRouter);

module.exports = router;
