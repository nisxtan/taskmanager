const { where } = require("sequelize");
const AppDataSource = require("../../config/database");
const Task = require("../../entity/Task");
const User = require("../../entity/User");

const EmailService = require("../../helper/email.helper");
const emailService = new EmailService();

const {
  taskCreatedTemplate,
  taskUpdatedTemplate,
  taskDeletedTemplate,
} = require("../../utils/email.templates");

module.exports.createTask = async (AppDataSource, taskData) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const userRepo = AppDataSource.getRepository(User);

  const newTask = taskRepo.create({
    title: taskData.title,
    description: taskData.description || null,
    isDone: false,
    userId: taskData.userId,
  });

  await taskRepo.save(newTask);

  try {
    const user = await userRepo.findOne({ where: { id: taskData.userId } });
    if (user && user.email) {
      await emailService.emailSend({
        to: user.email,
        subject: "✅ Task Created Successfully",
        message: taskCreatedTemplate(
          user.username,
          newTask.title,
          newTask.description
        ),
      });
      console.log(`Email sent to ${user.email} for task creation`);
    }
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }

  return newTask;
};

module.exports.getAll = async (AppDataSource, userId) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const taskList = await taskRepo.find({
    where: { userId: userId },
    order: {
      createdAt: "DESC",
    },
  });
  return taskList;
};

module.exports.getTaskById = async (AppDataSource, id, userId) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const task = await taskRepo.findOne({ where: { id, userId } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }
  return task;
};

module.exports.updateTask = async (AppDataSource, id, userId, newDetails) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const userRepo = AppDataSource.getRepository(User);

  const task = await taskRepo.findOne({ where: { id, userId } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }

  await taskRepo.update(id, newDetails);
  const updatedTask = await taskRepo.findOne({ where: { id } });

  try {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (user && user.email) {
      await emailService.emailSend({
        to: user.email,
        subject: "✏️ Task Updated Successfully",
        message: taskUpdatedTemplate(
          user.username,
          updatedTask.title,
          updatedTask.description
        ),
      });
      console.log(`Email sent to ${user.email} for task update`);
    }
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }

  return updatedTask;
};

module.exports.deleteTask = async (AppDataSource, id, userId) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const userRepo = AppDataSource.getRepository(User);

  const task = await taskRepo.findOne({ where: { id, userId } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }

  const taskTitle = task.title;
  await taskRepo.remove(task);

  try {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (user && user.email) {
      await emailService.emailSend({
        to: user.email,
        subject: "🗑️ Task Deleted Successfully",
        message: taskDeletedTemplate(user.username, taskTitle),
      });
      console.log(`Email sent to ${user.email} for task deletion`);
    }
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }

  return task;
};

module.exports.toggleTaskStatus = async (AppDataSource, id, userId) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const task = await taskRepo.findOne({ where: { id, userId } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }
  task.isDone = !task.isDone;
  await taskRepo.save(task);
  return task;
};
