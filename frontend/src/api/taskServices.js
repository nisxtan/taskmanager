import axiosInstance from "./axios";

const taskService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/task");
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (taskData) => {
    try {
      const response = await axiosInstance.post("/task", taskData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/task/${id}`);
      return response.data; // delete might return just a message
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  toggleStatus: async (id) => {
    try {
      // adjust endpoint if your backend uses a different route (e.g. PATCH /task/:id/toggle)
      const response = await axiosInstance.patch(`/task/toggle/${id}`);
      return response.data.data; // updated task with toggled isDone
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, updateData) => {
    try {
      const response = await axiosInstance.put(`/task/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default axiosInstance;
