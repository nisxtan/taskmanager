import axiosInstance from "./axios";

const userService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/user/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/user/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin login
  adminLogin: async (credentials) => {
    try {
      const response = await axiosInstance.post(
        "/user/admin/login",
        credentials
      );
      console.log("Admin login response: ", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/list-all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/user/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users with their roles
  getAllUsersWithRoles: async () => {
    try {
      const response = await axiosInstance.get("/user/admin/users-with-roles");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all roles with permissions
  getAllRoles: async () => {
    try {
      const response = await axiosInstance.get("/user/admin/roles");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all permissions
  getAllPermissions: async () => {
    try {
      const response = await axiosInstance.get("/user/admin/permissions");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assign role to user
  assignRoleToUser: async (userId, roleId) => {
    try {
      const response = await axiosInstance.put(
        `/user/admin/users/${userId}/assign-role`,
        {
          roleId: roleId,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove role from user
  removeRoleFromUser: async (userId) => {
    try {
      const response = await axiosInstance.put(
        `/user/admin/users/${userId}/remove-role`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ NEW: Role CRUD operations
  createRole: async (roleData) => {
    try {
      const response = await axiosInstance.post("/user/admin/roles", roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await axiosInstance.put(
        `/user/admin/roles/${id}`,
        roleData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/admin/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ NEW: Permission CRUD operations
  createPermission: async (permissionData) => {
    try {
      const response = await axiosInstance.post(
        "/user/admin/permissions",
        permissionData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePermission: async (id, permissionData) => {
    try {
      const response = await axiosInstance.put(
        `/user/admin/permissions/${id}`,
        permissionData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deletePermission: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/user/admin/permissions/${id}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //
  assignPermissionsToRole: async (roleId, permissions) => {
    try {
      const response = await axiosInstance.put(
        `/user/admin/roles/${roleId}/permissions`,
        {
          permissions,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
