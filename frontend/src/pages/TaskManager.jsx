"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
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
      //check if user has permission to view tasks
      if (!canViewTask && !user?.isAdmin) {
        setError("You don't have permission to view tasks");
        setTasks([]);
        return;
      }

      const response = await taskService.getAll();
      setTasks(response || []);
      setError("");
    } catch (err) {
      console.error("Error loading tasks:", err);
      if (err.message?.includes("Permission denied")) {
        setError("You don't have permission to view tasks");
        setTasks([]);
      } else {
        setError(err.message || "Failed to load tasks. Please try again.");
      }
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
      //permission error handling
      if (err.message?.includes("Permission denied")) {
        setError("You don't have permission to create tasks.");
      } else {
        setError(err.message || "Failed to add task. Please try again.");
      }
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
      if (err.message?.includes("Permission denied")) {
        setError("You don't have permission to delete tasks");
      } else {
        setError(err.message || "Failed to delete task");
      }
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

  const printTask = (task) => {
    const printWindow = window.open("", "_blank");

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Task - ${task.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="p-8">
        <div class="max-w-2xl mx-auto">
          <div class="border-b-2 border-teal-500 pb-4 mb-6">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">${
              task.title
            }</h1>
            <p class="text-sm text-slate-500">
              Printed on: ${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <span class="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
              task.isDone
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }">
              ${task.isDone ? "✓ Completed" : "⏳ Pending"}
            </span>
          </div>
          
          <div class="mt-6">
            <h2 class="text-lg font-semibold text-slate-700 mb-3">Description</h2>
            <div class="p-4 bg-slate-50 rounded-lg border-l-4 border-teal-500 ${
              !task.description ? "text-slate-400 italic" : "text-slate-700"
            }">
              ${task.description || "No description provided"}
            </div>
          </div>
          
          <div class="mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
            Task provided by - ${user?.username || "User"}
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const printAllTasks = () => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name = "viewport" content = "width=device-width, initial-scale=1.0">
        <title>All tasks - Task Manager</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
        body{ opacity:0, transition: opacity 0.1s ;}
        body.loaded{opacity:1;}
        @media print{
        .task-card {page-break-inside: avoid;}
      }
        </style>
      </head>
      <body class="p-8">
        <div class="max-w-4xl mx-auto">
          <div class = "border-b-2 border-teal-500 pb-4 mb-8">
            <h1 class = "text-4xl font-bold text-slate-800 mb-2">
              Task Manager - All Tasks
            </h1>
            <p class = "text-sm text-slate-500">
              Generated on : ${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p class="text-sm text-slate-600 mt-1">
              Total Tasks: ${tasks.length}
            </p>
          </div>
          <div class ="space-y-4">
              ${tasks
                .map(
                  (task, index) => `
                <div class="task-card border-2 border-slate-200 rounded-lg p-4 bg-white">
                  <div class="flex items-start gap-3">
                    <span class="text-lg font-bold text-slate-400">
                      ${index + 1}
                    </span>
                    <div class = "flex-1">
                      <div class = "flex items-start justify-between gap-4">
                        <h3 class = "text-xl font-bold text-slate-800 ${
                          task.isDone ? "line-through" : ""
                        }">${task.title}
                        </h3>
                        <span class="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                          task.isDone
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">
                        ${task.isDone ? "✓ Completed" : "⏳ Pending"}
                        </span> 
                      </div>  
                      ${
                        task.description
                          ? `
                      <p class="mt-2 text-slate-600 text-sm">${task.description}</p>
                    `
                          : `
                      <p class="mt-2 text-slate-400 text-sm italic">No description</p>
                    `
                      }
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
          </div>
           
          <div class="mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-400">
            Task Manager - ${user?.username || "User"}
          </div>
        </div>
           <script>
          setTimeout(function() {
            document.body.classList.add('loaded');
            setTimeout(function() {
              window.print();
            }, 100);
          }, 300);
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const downloadExcel = () => {
    //create CSV content
    const headers = ["No.", "Title", "Description", "Status"];
    const rows = tasks.map((task, index) => [
      index + 1,
      task.title,
      task.description || "No description",
      task.isDone ? "Completed" : "Pending",
    ]);

    //escape fields that contain commas or quotes
    const escapeCSV = (field) => {
      if (field == null) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("/n")) {
        return `"${str.replace(/"/g, '"')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    //create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `tasks_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasPermission = (permissionName) => {
    // return user?.isAdmin || user?.permissions?.includes(permissionName);
    if (user?.isAdmin) return true;
    if (!user?.permissions) return false;
    return user.permissions.includes(permissionName);
  };
  const canCreateTask = hasPermission("CREATE_TASK");
  const canEditTask = hasPermission("EDIT_TASK");
  const canDeleteTask = hasPermission("DELETE_TASK");
  const canViewTask = hasPermission("VIEW_TASKS");
  console.log("🔍 DEBUG PERMISSIONS:", {
    user: user,
    permissions: user?.permissions,
    canViewTask: canViewTask,
    canCreateTask: canCreateTask,
    canEditTask: canEditTask,
    canDeleteTask: canDeleteTask,
  });
  console.log("User object", user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
                📝 Task Manager
              </h1>
              {isAuthenticated && (
                <div className="text-sm sm:text-md text-slate-600 sm:border-l-2 sm:border-slate-300 sm:pl-6">
                  Welcome,{" "}
                  <span className="font-semibold text-teal-600">
                    {user.username}
                  </span>
                </div>
              )}
              <Link
                to="/profile"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                My Profile
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <button
                onClick={printAllTasks}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:to-blue-700 transition-all whitespace-nowrap flex-shrink-0"
              >
                Print All
              </button>

              <button
                onClick={downloadExcel}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:to-blue-700 transition-all whitespace-nowrap flex-shrink-0"
              >
                Download CSV
              </button>

              {canCreateTask && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all whitespace-nowrap flex-shrink-0"
                >
                  ➕ Add Task
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap flex-shrink-0"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Task List with Heading */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">
            Your Tasks
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-slate-500">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-white rounded-xl shadow">
                <div className="mb-2 text-6xl">📭</div>
                <p className="text-lg px-4">
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
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={() => toggleTask(task.id)}
                        disabled={!canEditTask} // disable if no edit permission
                        className="w-5 h-5 mt-1 cursor-pointer accent-teal-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base sm:text-lg font-semibold break-words ${
                            task.isDone
                              ? "line-through text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-slate-600 break-words">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                        <button
                          onClick={() => printTask(task)}
                          className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                          title="Print task"
                        >
                          🖨️ Print
                        </button>

                        {canEditTask && (
                          <button
                            onClick={() => startEdit(task)}
                            className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {canDeleteTask && (
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
