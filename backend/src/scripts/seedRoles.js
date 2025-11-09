const AppDataSource = require("../config/database");
require("dotenv").config();

async function seedRolesAndPermissions() {
  console.log("Starting seed script...");
  await AppDataSource.initialize();
  console.log("Database connected!");

  const roleRepository = AppDataSource.getRepository("Role");
  const permissionRepository = AppDataSource.getRepository("Permission");
  const userRepository = AppDataSource.getRepository("User");

  // Create permissions first
  const permissions = [
    { name: "CREATE_TASK", description: "Can create new tasks" },
    { name: "EDIT_TASK", description: "Can edit existing tasks" },
    { name: "DELETE_TASK", description: "Can delete tasks" },
    { name: "VIEW_TASKS", description: "Can view tasks" }, // Fixed name to VIEW_TASKS
  ];

  const createdPermissions = {};
  for (const permData of permissions) {
    let permission = await permissionRepository.findOne({
      where: { name: permData.name },
    });

    if (!permission) {
      permission = permissionRepository.create(permData);
      await permissionRepository.save(permission);
      createdPermissions[permData.name] = permission;
      console.log(`✅ Created permission: ${permData.name}`);
    } else {
      createdPermissions[permData.name] = permission;
      console.log(`⚠️ Permission exists: ${permData.name}`);
    }
  }

  // Create roles and assign permissions
  const roles = [
    {
      name: "admin",
      description: "Full system access.",
      permissions: ["CREATE_TASK", "EDIT_TASK", "DELETE_TASK", "VIEW_TASKS"], // Fixed to VIEW_TASKS
    },
    {
      name: "editor",
      description: "Can create and edit tasks",
      permissions: ["CREATE_TASK", "EDIT_TASK", "VIEW_TASKS"], // Fixed to VIEW_TASKS
    },
    {
      name: "viewer",
      description: "Can only view tasks",
      permissions: ["VIEW_TASKS"], // Fixed to VIEW_TASKS
    },
  ];

  for (const roleData of roles) {
    let role = await roleRepository.findOne({
      where: { name: roleData.name },
      relations: ["permissions"],
    });

    if (!role) {
      role = roleRepository.create({
        name: roleData.name,
        description: roleData.description,
      });
      await roleRepository.save(role);
      console.log(`✅ Created role: ${roleData.name}`);
    }

    // Assign permissions to role
    const rolePermissions = roleData.permissions.map(
      (permName) => createdPermissions[permName]
    );
    role.permissions = rolePermissions;
    await roleRepository.save(role);
    console.log(
      `✅ Assigned permissions to ${roleData.name}: ${roleData.permissions.join(
        ", "
      )}`
    );
  }

  // Assign admin role to admin user
  const adminUser = await userRepository.findOne({
    where: { email: "admin@taskmanager.com" },
  });
  const adminRole = await roleRepository.findOne({
    where: { name: "admin" },
  });

  if (adminUser && adminRole) {
    adminUser.roleId = adminRole.id;
    await userRepository.save(adminUser);
    console.log("✅ Assigned admin role to admin user");
  }

  console.log("🎉 Seeding completed successfully!");
  process.exit(0);
}

seedRolesAndPermissions().catch((error) => {
  console.error("❌ Error in seed script:", error);
  process.exit(1);
});
