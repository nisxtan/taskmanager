import { useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("users");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch roles for dropdown
      const rolesResponse = await userService.getAllRoles();
      setRoles(rolesResponse.data);

      if (activeTab === "users") {
        const usersResponse = await userService.getAllUsersWithRoles();
        const regularUsers = usersResponse.data.filter((user) => !user.isAdmin);
        setUsers(regularUsers);
      } else if (activeTab === "permissions") {
        const permissionsResponse = await userService.getAllPermissions();
        setPermissions(permissionsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, user, activeTab]);

  // Role Management Functions
  const handleCreateRole = async (roleData) => {
    try {
      await userService.createRole(roleData);
      setMessage("Role created successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error creating role");
    }
  };

  const handleUpdateRole = async (id, roleData) => {
    try {
      await userService.updateRole(id, roleData);
      setMessage("Role updated successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error updating role");
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await userService.deleteRole(id);
      setMessage("Role deleted successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error deleting role");
    }
  };

  // Permission Management Functions
  const handleCreatePermission = async (permissionData) => {
    try {
      await userService.createPermission(permissionData);
      setMessage("Permission created successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error creating permission");
    }
  };

  const handleUpdatePermission = async (id, permissionData) => {
    try {
      await userService.updatePermission(id, permissionData);
      setMessage("Permission updated successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error updating permission");
    }
  };

  const handleDeletePermission = async (id) => {
    try {
      await userService.deletePermission(id);
      setMessage("Permission deleted successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error deleting permission");
    }
  };

  // User-Role Management
  const handleAssignRole = async (userId, roleId) => {
    try {
      await userService.assignRoleToUser(userId, roleId);
      setMessage("Role assigned successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error assigning role");
    }
  };

  const handleRemoveRole = async (userId) => {
    try {
      await userService.removeRoleFromUser(userId);
      setMessage("Role removed successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error removing role");
    }
  };

  // Role-Permission Management
  const handleAssignPermissions = async (roleId, permissionIds) => {
    try {
      await userService.assignPermissionsToRole(roleId, permissionIds);
      setMessage("Permissions assigned successfully");
      fetchData();
    } catch (error) {
      setMessage(error.message || "Error assigning permissions");
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

        {/* Message Alert */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

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
              🎭 Role Management
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "permissions"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🔐 Permission Management
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

        {/* Role Management Tab */}
        {activeTab === "roles" && (
          <RoleManagement
            roles={roles}
            permissions={permissions}
            loading={loading}
            onCreateRole={handleCreateRole}
            onUpdateRole={handleUpdateRole}
            onDeleteRole={handleDeleteRole}
            onAssignPermissions={handleAssignPermissions}
          />
        )}

        {/* Permission Management Tab */}
        {activeTab === "permissions" && (
          <PermissionManagement
            permissions={permissions}
            loading={loading}
            onCreatePermission={handleCreatePermission}
            onUpdatePermission={handleUpdatePermission}
            onDeletePermission={handleDeletePermission}
          />
        )}
      </div>
    </div>
  );
};

// Role Management Component
const RoleManagement = ({
  roles,
  permissions,
  loading,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  onAssignPermissions,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      onUpdateRole(editingRole.id, formData);
    } else {
      onCreateRole(formData);
    }
    setShowCreateForm(false);
    setEditingRole(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Role Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          + Create Role
        </button>
      </div>

      {/* Create/Edit Role Form */}
      {(showCreateForm || editingRole) && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingRole ? "Edit Role" : "Create New Role"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                {editingRole ? "Update Role" : "Create Role"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingRole(null);
                  setFormData({ name: "", description: "" });
                }}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {role.name}
                  </h3>
                  <p className="text-slate-600 text-sm">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setFormData({
                        name: role.name,
                        description: role.description,
                      });
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteRole(role.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
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
  );
};

// Permission Management Component
const PermissionManagement = ({
  permissions,
  loading,
  onCreatePermission,
  onUpdatePermission,
  onDeletePermission,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPermission) {
      onUpdatePermission(editingPermission.id, formData);
    } else {
      onCreatePermission(formData);
    }
    setShowCreateForm(false);
    setEditingPermission(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Permission Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          + Create Permission
        </button>
      </div>

      {/* Create/Edit Permission Form */}
      {(showCreateForm || editingPermission) && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPermission ? "Edit Permission" : "Create New Permission"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Permission Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                {editingPermission ? "Update Permission" : "Create Permission"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPermission(null);
                  setFormData({ name: "", description: "" });
                }}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800">
                  {permission.name}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingPermission(permission);
                      setFormData({
                        name: permission.name,
                        description: permission.description,
                      });
                    }}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeletePermission(permission.id)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-slate-600 text-sm">{permission.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
