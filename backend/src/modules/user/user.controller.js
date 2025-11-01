const { TopologyDescriptionChangedEvent } = require("typeorm");
const userService = require("./user.services");
const { generateToken } = require("../../utils/jwt");

class UserController {
  async register(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const data = req.body;
      console.log("Received data:", data);
      console.log("Username:", data.username);
      console.log("Email:", data.email);
      console.log("Password:", data.password);
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

  //!LOGIN API
  async login(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required.",
        });
      }

      const user = await userService.findUserByEmail(AppDataSource, email);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const pwMatch = await userService.comparePassword(
        password,
        user.password
      );
      if (!pwMatch) {
        return res.status(401).json({
          message: "Invalid credentials.",
        });
      }
      //? token

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      res.status(200).json({
        message: "Login successfull",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          token: token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const users = await userService.getAllUsers(AppDataSource);

      res.status(200).json({
        message: "All users fetched.",
        data: users,
      });
      console.log(users);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const id = parseInt(req.params.id, 10); // 👈 convert to number
      const newData = req.body;

      const updatedUser = await userService.updateUser(
        AppDataSource,
        id,
        newData
      );

      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const id = parseInt(req.params.id, 10);

      await userService.deleteUser(AppDataSource, id);
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
