const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Permission",
  tableName: "permissions",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", unique: true },
    description: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    roles: {
      type: "many-to-many",
      target: "Role",
      inverseSide: "permissions",
    },
  },
});
