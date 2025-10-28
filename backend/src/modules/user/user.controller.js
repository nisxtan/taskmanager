const userService = require("./user.services");

class UserController {
  async register(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const data = req.body;

      if (!data.username || !data.email || !data.password) {
        return res.status(400).json({
          message: "All fields are required!!",
        });
      }

      const user = await userService.createUser(AppDataSource, data);

      res.status(201).json({
        message: "User registered successfully",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
