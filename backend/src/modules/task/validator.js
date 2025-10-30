const yup = require("yup");

// Schema for creating a new task
const createTaskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(1, "Title must be at least 1 character long")
    .max(255, "Title cannot exceed 255 characters")
    .trim(),
  description: yup
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .trim()
    .nullable()
    .optional(),
  isDone: yup.boolean().optional().default(false),
});

// Schema for updating a task
const updateTaskSchema = yup
  .object({
    title: yup
      .string()
      .min(1, "Title must be at least 1 character long")
      .max(255, "Title cannot exceed 255 characters")
      .trim()
      .optional(),
    description: yup
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .trim()
      .nullable()
      .optional(),
    isDone: yup.boolean().optional(),
  })
  .test(
    "at-least-one",
    "At least one field must be provided for update",
    (value) => {
      return Object.keys(value).length > 0;
    }
  );

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
