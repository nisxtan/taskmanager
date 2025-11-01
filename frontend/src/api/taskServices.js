import axiosInstance from "./axios";

const taskService = {
  getAll: async () => {
    try {
      // const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get("/task");
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (taskData) => {
    try {
      // const userId = localStorage.getItem("userId");
      // const response = await axiosInstance.post("/task", {
      //   ...taskData,
      //   userId: parseInt(userId),
      // });
      const response = await axiosInstance.post("/task", taskData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      // const userId = localStorage.getItem("userId");
      const response = await axiosInstance.delete(`/task/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  toggleStatus: async (id) => {
    try {
      // const userId = localStorage.getItem("userId");
      const response = await axiosInstance.patch(`/task/${id}/toggle`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, updateData) => {
    try {
      // const userId = localStorage.getItem("userId");
      const response = await axiosInstance.put(`/task/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default taskService;
