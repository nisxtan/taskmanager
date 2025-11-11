const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    username: { type: "varchar", unique: true },
    email: { type: "varchar", unique: true },
    googleId: {
      type: "varchar",
      nullable: true,
      unique: true,
    },
    password: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
    isAdmin: { type: "boolean", default: false },
    roleId: { type: "int", nullable: true },
  },
  relations: {
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: { name: "roleId" },
      nullable: true,
    },
  },
});
