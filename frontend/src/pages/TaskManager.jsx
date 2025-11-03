"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import taskService from "../api/taskServices";
import {
  selectUser,
  selectIsAuthenticated,
  logout,
} from "../redux/slices/authSlice";

const TaskManager = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    dispatch(logout());
    navigate("/login");
  };

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
      setShowModal(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
              📝 Task Manager
            </h1>
            {isAuthenticated && (
              <div className="text-md text-slate-600 border-l-2 border-slate-300 pl-6">
                Welcome,{" "}
                <span className="font-semibold text-teal-600">
                  {user.username}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all"
            >
              ➕ Add Task
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Task List with Heading */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Your Tasks</h2>

          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-slate-500">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-white rounded-xl shadow">
                <div className="mb-2 text-6xl">📭</div>
                <p className="text-lg">
                  No tasks yet. Click "Add Task" to create one!
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-xl transition-all duration-200 bg-white shadow-sm ${
                    task.isDone
                      ? "border-slate-200 opacity-60"
                      : "border-slate-200 hover:border-teal-300 hover:shadow-md"
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
        </div>
      </div>

      {/* Modal for Adding Task */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Add New Task
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ title: "", description: "" });
                  setError("");
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoFocus
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
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all"
                >
                  ➕ Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ title: "", description: "" });
                    setError("");
                  }}
                  className="px-6 py-3 font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
