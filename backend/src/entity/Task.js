const { EntitySchema, JoinColumn } = require("typeorm");

module.exports = new EntitySchema({
  name: "Task",
  tableName: "tasks",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    description: { type: "text", nullable: true },
    isDone: { type: "boolean", default: false },
    userId: { type: "int", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  // relations: {
  //   user: {
  //     type: "many-to-one",
  //     target: "user",
  //     joinColumn: { name: "userId" },
  //     inverseSide: "tasks",
  //   },
  // },
});
