"use client";

import { useState, useEffect } from "react";
import taskService from "../api/taskServices";
import { Navigate, useNavigate } from "react-router-dom";
const TaskManager = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response || []);
      setError("");
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError(err.message || "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // Add this button in your JSX

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a task title");
      return;
    }

    try {
      await taskService.create({
        title: formData.title,
        description: formData.description || null,
        isDone: false,
      });

      setFormData({ title: "", description: "" });
      setError("");
      loadTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message || "Failed to add task. Please try again.");
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await taskService.toggleStatus(taskId);
      loadTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
      setError(err.message || "Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setError("");
      loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.message || "Failed to delete task");
    }
  };

  const startEdit = (task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const saveEdit = async () => {
    if (!editingTask.title.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    try {
      await taskService.update(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description || null,
      });

      setEditingTask(null);
      setError("");
      loadTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message || "Failed to update task");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h1 className="mb-8 text-4xl font-bold text-center bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
          📝 My Tasks
        </h1>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="mb-8 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title (e.g., Learn React)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="2"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:scale-95"
          >
            ➕ Add Task
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-8 text-center text-slate-500">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <div className="mb-2 text-4xl">📭</div>
              <p>No tasks yet. Add your first task!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-xl transition-all duration-200 ${
                  task.isDone
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : "bg-white border-slate-200 hover:border-teal-300 hover:shadow-md hover:bg-teal-50"
                }`}
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                    />
                    <textarea
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                      rows="2"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={saveEdit}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-slate-400 rounded-lg hover:bg-slate-500 transition-colors"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 mt-1 cursor-pointer accent-teal-600"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          task.isDone
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-1 text-sm text-slate-600">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TaskManager;
