import axiosInstance from "./axios";

const userService = {
  //register user

  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/user/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/user/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

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

  //get all users
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/list-all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //update user
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/user/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //delete user
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //get all users with their roles

  getAllUsersWithRoles: async () => {
    try {
      const response = await axiosInstance.get("/user/admin/users-with-roles");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //get all roles with permissions
  getAllRoles: async () => {
    try {
      const response = await axiosInstance.get("/user/admin/roles");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //get all permissions
  getAllPermissions: async () => {
    try {
      const response = await axiosInstance.get("/user/admin/permissions");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //assign role to users
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

  //remove role from user
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
};

export default userService;
