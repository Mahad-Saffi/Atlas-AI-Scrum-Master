import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/v1/projects`;

const getTasks = async (projectId: string) => {
  const token = localStorage.getItem("jwt"); // Fixed: use 'jwt' not 'token'
  const response = await axios.get(`${API_URL}/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const completeTask = async (taskId: string) => {
  const token = localStorage.getItem("jwt");
  try {
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Complete task error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getProjects = async () => {
  const token = localStorage.getItem("jwt");
  const response = await axios.get(`${API_BASE_URL}/api/v1/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const taskService = {
  getTasks,
  completeTask,
  getProjects,
};
