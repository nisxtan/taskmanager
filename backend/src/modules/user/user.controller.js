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

      const existingUser = await userService.findUserByEmail(
        AppDataSource,
        data.email
      );
      if (existingUser) {
        if (existingUser.googleId) {
          return res.status(400).json({
            message:
              "This email is already registered with google login, either use a new id or login.",
          });
        } else {
          return res.status(400).json({
            message:
              "Email already exists. Please use a different email or login",
          });
        }
      }

      const existingUsername = await userService.findUserByUsername(
        AppDataSource,
        data.username
      );
      if (existingUsername) {
        return res.status(400).json({
          message:
            "Username already exists. Please choose a different username.",
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
      //check if the user is admin
      if (user.isAdmin) {
        return res.status(401).json({
          message: "Admin accounts must use admin login at /admin/login",
        });
      }

      // check if user registered with Google OAuth
      if (user.googleId) {
        return res.status(401).json({
          message:
            "This account uses Google Login. Please click 'Login with Google'.",
        });
      }

      //CHECK: If user has no password (OAuth user without googleId - edge case)
      if (!user.password) {
        return res.status(401).json({
          message:
            "Account authentication error. Please use Google Login or contact support.",
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
        message: "Login successful",
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

  //admin login
  async adminLogin(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const ADMIN_EMAIL = "admin@taskmanager.com";
      const ADMIN_PASSWORD = "admin123";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        let adminUser = await userService.findUserByEmail(
          AppDataSource,
          ADMIN_EMAIL
        );
        if (!adminUser) {
          //create admin user
          adminUser = await userService.createUser(AppDataSource, {
            username: "admin",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            isAdmin: true,
          });
        } else if (!adminUser.isAdmin) {
          await userService.updateUser(AppDataSource, adminUser.id, {
            isAdmin: true,
          });
          adminUser.isAdmin = true;
        }

        //generate token
        const token = generateToken({
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          isAdmin: true,
        });

        return res.status(200).json({
          message: "Admin login successful",
          data: {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email,
            isAdmin: true,
            token: token,
          },
        });
      }
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    } catch (error) {
      next(error);
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

  async getAdminDashboard(req, res, next) {
    res.status(200).json({
      message: "admin dashboard test",
    });
  }

  //? get all users with their roles
  async getAllUsersWithRoles(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const userRepository = AppDataSource.getRepository("User");

      const users = await userRepository.find({
        relations: ["role"],
        select: ["id", "username", "email", "isAdmin", "createdAt", "roleId"],
      });

      res.status(200).json({
        message: "Users with roles fetched successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  //get all roles with permissions
  async getAllRoles(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const roleRepository = AppDataSource.getRepository("Role");

      const roles = await roleRepository.find({
        relations: ["permissions"],
      });

      req.status(200).json({
        message: "Roles with permission fetched.",
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  //get all permissions
  async getAllPermissions(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const permissionRepository = AppDataSource.getRepository("Permission");
      const permissions = await permissionRepository.find();
      res.status(200).json({
        message: "Permissions fetched successfully",
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  //assign role to user
  async assignRoleToUser(req, res, next) {
    const AppDataSource = req.app.get("AppDataSource");
    const userRepository = AppDataSource.getRepository("User");
    const roleRepository = AppDataSource.getRepository("Role");

    const userId = parseInt(req.params.id);
    const { roleId } = req.body;
    const user = await userRepository.findOne({ where: { id: userId } });
    const role = await userRepository.findOne({ where: { id: roleId } });
    if (!user || !role) {
      return res.status(400).json({
        message: "User or role not found",
      });
    }

    user.roleId = roleId;
    await userRepository.save(user);
    req.status(200).json({
      message: "Role assigned successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role,
      },
    });
  }

  //remove role form user
  async removeRoleFromUser(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const userRepository = AppDataSource.getRepository("User");

      const userId = parseInt(req.params.id);
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.roleId = null;
      await userRepository.save(user);
      res.status(200).json({
        message: "Role removed successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
