const AppDataSource = require("../../config/database");
const Task = require("../../entity/Task");

module.exports.createTask = async (AppDataSource, taskData) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const newTask = taskRepo.create({
    title: taskData.title,
    description: taskData.description || null,
    isDone: false,
    userId: taskData.userId,
  });

  await taskRepo.save(newTask);
  return newTask;
};

module.exports.getAll = async (AppDataSource) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const taskList = await taskRepo.find({
    order: {
      createdAt: "DESC",
    },
  });
  return taskList;
};

module.exports.getTaskById = async (AppDataSource, id) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const task = await taskRepo.findOne({ where: { id } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }
  return task;
};

module.exports.updateTask = async (AppDataSource, id, newDetails) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const task = await taskRepo.findOne({ where: { id } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }
  await taskRepo.update(id, newDetails);
  const updatedTask = await taskRepo.findOne({ where: { id } });
  return updatedTask;
};

module.exports.deleteTask = async (AppDataSource, id) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const task = await taskRepo.findOne({ where: { id } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }

  await taskRepo.remove(task);
  return task;
};

module.exports.toggleTaskStatus = async (AppDataSource, id) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const task = await taskRepo.findOne({ where: { id } });
  if (!task) {
    throw { code: 404, message: "Task not found" };
  }
  task.isDone = !task.isDone;
  await taskRepo.save(task);
  return task;
};
