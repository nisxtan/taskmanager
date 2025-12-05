const userService = require("./user.services");
const { generateToken } = require("../../utils/jwt");
const { In, MongoUnexpectedServerResponseError } = require("typeorm");
const AppDataSource = require("../../config/database");

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

      //get user with role and permission
      const userRepository = AppDataSource.getRepository("User");
      const userWithPermissions = await userRepository.findOne({
        where: { id: user.id },
        relations: ["role", "role.permissions"],
      });

      const permissions = userWithPermissions.role.permissions.map(
        (p) => p.name
      );

      //? token

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        permissions: permissions,
        role: userWithPermissions.role ? userWithPermissions.role.name : null,
      });
      console.log("🔍 FINAL RESPONSE PERMISSIONS:", permissions);
      console.log("🔍 FULL RESPONSE DATA:", {
        id: user.id,
        username: user.username,
        email: user.email,
        token: token,
        permissions: permissions, // This should show all three
        role: userWithPermissions?.role?.name || null,
      });

      res.status(200).json({
        message: "Login successful",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          token: token,
          permissions: permissions,
          role: userWithPermissions.role ? userWithPermissions.role.name : null,
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

        //get admin user with roles and permission
        const userRepository = AppDataSource.getRepository("User");
        const adminWithPermissions = await userRepository.findOne({
          where: { id: adminUser.id },
          relations: ["role", "role.permissions"],
        });

        //admin permissions - combine role permissions with admin defaults
        let permissions = [];
        if (
          adminWithPermissions.role &&
          adminWithPermissions.role.permissions
        ) {
          permissions = adminWithPermissions.role.permissions.map(
            (p) => p.name
          );
        }

        //add admin-specific permission
        const adminDefaultPermissions = [
          "CREATE_TASK",
          "EDIT_TASK",
          "DELETE_TASK",
          "VIEW_TASKS",
          "manage_users",
          "manage_roles",
          "admin_dashboard",
        ];

        //merge and remove duplicates
        permissions = [
          ...new Set([...permissions, ...adminDefaultPermissions]),
        ];

        //generate token
        const token = generateToken({
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          isAdmin: true,
          permissions: permissions,
        });

        return res.status(200).json({
          message: "Admin login successful",
          data: {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email,
            isAdmin: true,
            token: token,
            permissions: permissions, // send actual permissions
            role: adminDefaultPermissions.role
              ? adminDefaultPermissions.role.name
              : "admin",
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
      const id = parseInt(req.params.id, 10); //  convert to number
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

  async getCurrentUser(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      console.log(req.user.id);
      const user = await userService.getUserProfile(AppDataSource, req.user.id);
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }
      res.status(200).json({
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCurrentUser(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { username, email } = req.body;
      if (!username || !email) {
        return res.status(400).json({
          message: "No data to update",
        });
      }
      //check if username already exists
      if (username) {
        const usernameTaken = await userService.isUserNameTaken(
          AppDataSource,
          username,
          req.user.id
        );
        if (usernameTaken) {
          return res.status(400).json({
            message: "Username already taken.",
          });
        }
      }

      //check if email is already taken
      if (email) {
        const emailTaken = await userService.isEmailTaken(
          AppDataSource,
          email,
          req.user.id
        );
        if (emailTaken) {
          return res.status(400).json({
            message:
              "Email is already registered, please use a different email",
          });
        }
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      const updatedUser = await userService.updateUser(
        AppDataSource,
        req.user.id,
        updateData
      );
      res.status(200).json({
        message: "Profile updated successfully",
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current and new password are required",
        });
      }
      if (newPassword.length < 5) {
        return res.status(400).json({
          message: "Password must at least be 6 characters",
        });
      }

      //get user with password
      const user = await userService.findUserByEmail(
        AppDataSource,
        req.user.email
      );
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      //verify current password is correct
      const isCurrentPasswordValid = await userService.comparePassword(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(AppDataSource, req.user.id, {
        password: hashedPassword,
      });
      res.status(200).json({
        message: "Password change successfully",
      });
    } catch (error) {
      next(error);
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

      res.status(200).json({
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
    const role = await roleRepository.findOne({ where: { id: roleId } });
    if (!user || !role) {
      return res.status(400).json({
        message: "User or role not found",
      });
    }

    user.roleId = roleId;
    await userRepository.save(user);
    res.status(200).json({
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

  //!Create new role

  async createRole(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { name, description, permissions } = req.body;
      const roleRepository = AppDataSource.getRepository("Role");
      const permissionRepository = AppDataSource.getRepository("Permission");

      //check if role already exists
      const existingRole = await roleRepository.findOne({ where: { name } });
      if (existingRole) {
        return res.status(400).json({
          message: "Role already exists.",
        });
      }

      //find permisssions by id
      let permissionEntities = [];
      if (permissions && permissions.length > 0) {
        permissionEntities = await permissionRepository.find({
          where: { id: In(permissions) },
        });
      }

      //?create and save role
      const role = roleRepository.create({
        name,
        description,
        permissions: permissionEntities,
      });
      await roleRepository.save(role);

      res.status(201).json({
        message: "Role created successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  //!update role
  async updateRole(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name && !description) {
        return res.status(400).json({
          message: "Name or description is required to update",
        });
      }

      const roleRepository = AppDataSource.getRepository("Role");

      const role = await roleRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!role) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      // Check if name is being changed and already exists
      if (name && name !== role.name) {
        const existingRole = await roleRepository.findOne({ where: { name } });
        if (existingRole) {
          return res.status(400).json({
            message: "Role name already exists",
          });
        }
        role.name = name;
      }

      if (description) role.description = description;

      await roleRepository.save(role);

      res.status(200).json({
        message: "Role updated successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  //!delete role
  async deleteRole(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { id } = req.params;
      const roleRepository = AppDataSource.getRepository("Role");
      const userRepository = AppDataSource.getRepository("User");

      // Check if any users have this role
      const usersWithRole = await userRepository.find({
        where: { roleId: parseInt(id) },
      });

      if (usersWithRole.length > 0) {
        return res.status(400).json({
          message: "Cannot delete role. There are users assigned to this role.",
        });
      }

      const result = await roleRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      res.status(200).json({
        message: "Role deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  //!!!! permission CRUD
  //! Create new permission
  async createPermission(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { name, description } = req.body;
      const permissionRepository = AppDataSource.getRepository("Permission");

      // Check if permission already exists
      const existingPermission = await permissionRepository.findOne({
        where: { name },
      });

      if (existingPermission) {
        return res.status(400).json({
          message: "Permission already exists",
        });
      }

      const permission = permissionRepository.create({
        name,
        description,
      });

      await permissionRepository.save(permission);

      res.status(201).json({
        message: "Permission created successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }

  //!update permission
  async updatePermission(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { id } = req.params;
      const { name, description } = req.body;
      const permissionRepository = AppDataSource.getRepository("Permission");

      const permission = await permissionRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!permission) {
        return res.status(404).json({
          message: "Permission not found",
        });
      }
      if (name) permission.name = name;
      if (description) permission.description = description;

      await permissionRepository.save(permission);

      res.status(200).json({
        message: "permission updated successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }

  //!delete permission
  async deletePermission(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { id } = req.params;
      const permissionRepository = AppDataSource.getRepository("Permission");
      const roleRepository = AppDataSource.getRepository("Role");

      //check if any roles have this permission
      const allRoles = await roleRepository.find({
        relations: ["permissions"],
      });

      const rolesWithPermission = allRoles.filter((role) =>
        role.permissions.some((permission) => permission.id === parseInt(id))
      );
      if (rolesWithPermission.length > 0) {
        return res.status(400).json({
          message: "Cannot delete permission, it is assigned to some users",
        });
      }
      const result = await permissionRepository.delete(parseInt(id));
      if (result.affected === 0) {
        return res.status(400).json({
          message: "Permission not found",
        });
      }
      res.status(200).json({
        message: "Permission deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async assignPermissionsToRole(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { id } = req.params;
      const { permissions } = req.body;
      const roleRepository = AppDataSource.getRepository("Role");
      const permissionRepository = AppDataSource.getRepository("Permission");
      const role = await roleRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["permissions"],
      });
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      const permissionEntities = [];
      for (const permId of permissions) {
        const permission = await permissionRepository.findOne({
          where: { id: permId },
        });
        if (permission) {
          permissionEntities.push(permission);
        }
      }
      if (permissionEntities.length !== permissions.length) {
        return res.status(400).json({ message: "Some permissions not found" });
      }
      role.permissions = permissionEntities;
      await roleRepository.save(role);
      res.status(200).json({
        message: "Permissions assigned to role successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
