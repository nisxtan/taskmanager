const taskService = require("./task.services");
class TaskController {
  async createTask(req, res, next) {
    try {
      const AppDataSource = req.app.get("AppDataSource");
      const { title, description } = req.body;
      const userId = req.user.id;

      // console.log(data);
      if (!title) {
        return res.status(400).json({
          message: "Title is required",
        });
      }
      if (!userId) {
        return res.status(400).json({
          message: "User id is required",
        });
      }
      const task = await taskService.createTask(AppDataSource, {
        title,
        description,
        userId,
      });

      res.status(201).json({
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
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required!",
        });
      }
      const tasks = await taskService.getAll(AppDataSource, parseInt(userId));

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
      // const userId = req.query.userId;
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required!",
        });
      }
      const task = await taskService.getTaskById(
        AppDataSource,
        id,
        parseInt(userId)
      );
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
      const userId = req.user.id;

      const { updateData } = req.body;
      if (!userId) {
        return res.status(400).json({
          message: "User id is required",
        });
      }

      const updatedTask = await taskService.updateTask(
        AppDataSource,
        id,
        parseInt(userId),
        updateData
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
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required!",
        });
      }

      await taskService.deleteTask(AppDataSource, id, parseInt(userId));

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
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required!",
        });
      }
      const updatedTask = await taskService.toggleTaskStatus(
        AppDataSource,
        id,
        parseInt(userId)
      );

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
