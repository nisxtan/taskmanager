import axiosInstance from "./axios";

const taskService = {
  getAll: async () => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ Get userId
      const response = await axiosInstance.get(`/task?userId=${userId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (taskData) => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ Get userId
      const response = await axiosInstance.post("/task", {
        ...taskData,
        userId: parseInt(userId), // ✅ Include userId
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.delete(
        `/task/${id}?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  toggleStatus: async (id) => {
    try {
      const userId = localStorage.getItem("userId"); //
      const response = await axiosInstance.patch(`/task/${id}/toggle`, {
        userId: parseInt(userId),
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, updateData) => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ Get userId
      const response = await axiosInstance.put(`/task/${id}`, {
        ...updateData,
        userId: parseInt(userId),
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default taskService;
