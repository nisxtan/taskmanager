import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../api/userServices";
import { logout } from "../redux/slices/authSlice"; // Import your logout action

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

      // Always fetch permissions for role management
      const permissionsResponse = await userService.getAllPermissions();
      setPermissions(permissionsResponse.data);

      if (activeTab === "users") {
        const usersResponse = await userService.getAllUsersWithRoles();
        const regularUsers = usersResponse.data.filter((user) => !user.isAdmin);
        setUsers(regularUsers);
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

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

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
        {/* Header with Logout Button */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-600">
                Welcome back,{" "}
                <span className="font-semibold text-teal-600">
                  {user.username}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{message}</p>
            <button
              onClick={() => setMessage("")}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Dismiss
            </button>
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

// Role Management Component (keep this exactly as you have it)
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
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  // Initialize selected permissions when editing a role
  useEffect(() => {
    if (editingRole) {
      setSelectedPermissions(editingRole.permissions?.map((p) => p.id) || []);
      setFormData({
        name: editingRole.name,
        description: editingRole.description,
      });
    } else {
      setSelectedPermissions([]);
      setFormData({ name: "", description: "" });
    }
  }, [editingRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingRole) {
        // Update role details and permissions together
        await onUpdateRole(editingRole.id, formData);
        await onAssignPermissions(editingRole.id, selectedPermissions);
      } else {
        // Create new role
        const newRole = await onCreateRole(formData);
        // If we have a new role ID and permissions to assign, assign them
        if (newRole && selectedPermissions.length > 0) {
          await onAssignPermissions(newRole.id, selectedPermissions);
        }
      }

      // Reset form
      setShowCreateForm(false);
      setEditingRole(null);
      setFormData({ name: "", description: "" });
      setSelectedPermissions([]);
    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle permission selection
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(
      (prev) =>
        prev.includes(permissionId)
          ? prev.filter((id) => id !== permissionId) // Remove permission
          : [...prev, permissionId] // Add permission
    );
  };

  // Remove a single permission from selection
  const handleRemovePermission = (permissionId) => {
    setSelectedPermissions((prev) => prev.filter((id) => id !== permissionId));
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
        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">
            {editingRole ? "Edit Role & Permissions" : "Create New Role"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter role description"
                />
              </div>
            </div>

            {/* Permission Assignment Section */}
            <div className="border-t border-slate-200 pt-4 mt-4">
              <h4 className="text-md font-semibold text-slate-800 mb-3">
                Manage Permissions
              </h4>

              {/* Selected Permissions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selected Permissions ({selectedPermissions.length})
                </label>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border border-slate-200 rounded-lg bg-white">
                  {selectedPermissions.length === 0 ? (
                    <span className="text-slate-400 text-sm">
                      No permissions selected. Choose from the list below.
                    </span>
                  ) : (
                    selectedPermissions.map((permissionId) => {
                      const permission = permissions.find(
                        (p) => p.id === permissionId
                      );
                      return permission ? (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                        >
                          {permission.name}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePermission(permission.id)
                            }
                            className="ml-2 text-green-600 hover:text-green-800 focus:outline-none text-sm font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })
                  )}
                </div>
              </div>

              {/* Available Permissions */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Available Permissions
                </label>
                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4 bg-white">
                  {permissions.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No permissions available. Create some in the Permission
                      Management tab.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handlePermissionChange(permission.id)
                            }
                            className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-800 text-sm truncate">
                              {permission.name}
                            </div>
                            <div className="text-slate-600 text-xs mt-1 line-clamp-2">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4 justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : editingRole ? (
                  "Save Role & Permissions"
                ) : (
                  "Create Role"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingRole(null);
                  setFormData({ name: "", description: "" });
                  setSelectedPermissions([]);
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
          {roles.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No roles created yet. Create your first role to get started.
            </div>
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {role.name}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {role.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit Role & Permissions
                    </button>
                    <button
                      onClick={() => onDeleteRole(role.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Current Permissions Display */}
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Assigned Permissions:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.map((permission) => (
                      <span
                        key={permission.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Permission Management Component (keep this exactly as you have it)
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
                Permission Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                placeholder="e.g., user.create, user.delete"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
                required
                placeholder="Describe what this permission allows"
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
          {permissions.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-500">
              No permissions created yet. Create your first permission to get
              started.
            </div>
          ) : (
            permissions.map((permission) => (
              <div
                key={permission.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 text-sm">
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
                <p className="text-slate-600 text-xs mt-2">
                  {permission.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
