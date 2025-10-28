const router = require("express").Router();
const userRouter = require("../modules/user/user.router");

router.use("/users", userRouter);

module.exports = router;
