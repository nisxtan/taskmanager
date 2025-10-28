const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Task",
  tableName: "tasks",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    description: { type: "text", nullable: true },
    isDone: { type: "boolean", default: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});
