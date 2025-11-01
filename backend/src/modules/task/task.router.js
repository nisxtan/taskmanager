const taskController = require("./task.controller"); // ⚠️ Fix the typo!
const validateBody = require("../../middleware/validateBody");
const { createTaskSchema, updateTaskSchema } = require("./validator");
const authMiddleware = require("../../middleware/auth.middleware");
const taskRouter = require("express").Router();

// Create task with validation
taskRouter.post(
  "/",
  authMiddleware,
  validateBody(createTaskSchema),
  taskController.createTask
);

// Read
taskRouter.get("/", authMiddleware, taskController.getAllTask);
taskRouter.get("/:id", authMiddleware, taskController.getTaskById);

// Update task with validation
taskRouter.put(
  "/:id",
  authMiddleware,
  validateBody(updateTaskSchema),
  taskController.updateTask
);

// Toggle (no validation needed)
taskRouter.patch(
  "/:id/toggle",
  authMiddleware,
  taskController.toggleTaskStatus
);

// Delete
taskRouter.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = taskRouter;
