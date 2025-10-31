const taskService = require("./task.services");
class TaskController {
  async createTask(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const data = req.body;
      // console.log(data);
      if (!data.title) {
        return res.status(400).json({
          message: "Title is required",
        });
      }
      const task = await taskService.createTask(AppDataSource, data);

      res.status(200).json({
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllTask(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const tasks = await taskService.getAll(AppDataSource);

      res.status(200).json({
        message: "All tasks fetched",
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  }
  async getTaskById(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const id = parseInt(req.params.id, 10);
      const task = await taskService.getTaskById(AppDataSource, id);
      res.status(200).json({
        message: "task fetched successfully",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  //update task
  async updateTask(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const id = parseInt(req.params.id, 10);
      const newData = req.body;

      const updatedTask = await taskService.updateTask(
        AppDataSource,
        id,
        newData
      );

      res.status(200).json({
        message: "Task updated successfully",
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const id = parseInt(req.params.id, 10);

      await taskService.deleteTask(AppDataSource, id);

      res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleTaskStatus(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const id = parseInt(req.params.id, 10);

      const updatedTask = await taskService.toggleTaskStatus(AppDataSource, id);

      res.status(200).json({
        message: `Task marked as ${updatedTask.isDone ? "done" : "undone"}`,
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new TaskController();
