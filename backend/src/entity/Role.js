const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", unique: true },
    description: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    permissions: {
      type: "many-to-many",
      target: "Permission",
      joinTable: {
        name: "role_permissions",
        joinColumn: { name: "roleid", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permissionId", referencedColumnName: "id" },
      },
    },
    users: {
      type: "one-to-many",
      target: "User",
      inverseSide: "role",
    },
  },
});
