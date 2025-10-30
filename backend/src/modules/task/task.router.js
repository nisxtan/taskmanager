const taskController = require("./task.controller"); // ⚠️ Fix the typo!
const validateBody = require("../../middleware/validateBody");
const { createTaskSchema, updateTaskSchema } = require("./validator");

const taskRouter = require("express").Router();

// Create task with validation
taskRouter.post("/", validateBody(createTaskSchema), taskController.createTask);

// Read
taskRouter.get("/", taskController.getAllTask);
taskRouter.get("/:id", taskController.getTaskById);

// Update task with validation
taskRouter.put(
  "/:id",
  validateBody(updateTaskSchema),
  taskController.updateTask
);

// Toggle (no validation needed)
taskRouter.patch("/:id/toggle", taskController.toggleTaskStatus);

// Delete
taskRouter.delete("/:id", taskController.deleteTask);

module.exports = taskRouter;
