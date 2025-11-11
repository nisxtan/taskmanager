import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../api/userServices";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // "users", "roles", "permissions"

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (activeTab === "users") {
          const usersResponse = await userService.getAllUsersWithRoles();
          const regularUsers = usersResponse.data.filter(
            (user) => !user.isAdmin
          );
          setUsers(regularUsers);
        } else if (activeTab === "roles") {
          const rolesResponse = await userService.getAllRoles();
          setRoles(rolesResponse.data);
        } else if (activeTab === "permissions") {
          const permissionsResponse = await userService.getAllPermissions();
          setPermissions(permissionsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, user, activeTab]);

  const handleAssignRole = async (userId, roleId) => {
    try {
      await userService.assignRoleToUser(userId, roleId);
      // Refresh users data
      const usersResponse = await userService.getAllUsersWithRoles();
      const regularUsers = usersResponse.data.filter((user) => !user.isAdmin);
      setUsers(regularUsers);
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  const handleRemoveRole = async (userId) => {
    try {
      await userService.removeRoleFromUser(userId);
      // Refresh users data
      const usersResponse = await userService.getAllUsersWithRoles();
      const regularUsers = usersResponse.data.filter((user) => !user.isAdmin);
      setUsers(regularUsers);
    } catch (error) {
      console.error("Error removing role:", error);
    }
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back,{" "}
            <span className="font-semibold text-teal-600">{user.username}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex space-x-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "users"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              👥 Users & Roles
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "roles"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🎭 Roles & Permissions
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "permissions"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🔐 Permissions
            </button>
          </div>
        </div>

        {/* Users & Roles Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              User Role Management
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Current Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Assign Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {user.username}
                              </div>
                              <div className="text-sm text-slate-500">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.role ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.role.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                No Role
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                              onChange={(e) =>
                                handleAssignRole(user.id, e.target.value)
                              }
                              value=""
                            >
                              <option value="">Select Role</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            {user.role && (
                              <button
                                onClick={() => handleRemoveRole(user.id)}
                                className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Remove Role
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === "roles" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Roles & Their Permissions
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading roles...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {role.name}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {role.permissions?.length || 0} permissions
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions?.map((permission) => (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {permission.name}
                        </span>
                      ))}
                      {(!role.permissions || role.permissions.length === 0) && (
                        <span className="text-slate-400 text-sm">
                          No permissions assigned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === "permissions" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              System Permissions
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading permissions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {permission.name}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {permission.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
