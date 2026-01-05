import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/v1/projects`;

const getTasks = async (projectId: string) => {
  const token = localStorage.getItem("jwt"); // Fixed: use 'jwt' not 'token'
  // Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  const response = await axios.get(
    `${API_URL}/${projectId}/tasks?_t=${timestamp}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    }
  );
  return response.data;
};

const updateTask = async (taskId: string, updates: any) => {
  const token = localStorage.getItem("jwt");
  try {
    const response = await axios.patch(`${API_URL}/tasks/${taskId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Update task error:", error.response?.data || error.message);
    throw error;
  }
};

const completeTask = async (taskId: string) => {
  const token = localStorage.getItem("jwt");
  try {
    console.log("Completing task:", taskId);
    console.log("API URL:", `${API_URL}/tasks/${taskId}/complete`);
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Complete task response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Complete task error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: `${API_URL}/tasks/${taskId}/complete`,
    });
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
  updateTask,
  completeTask,
  getProjects,
};
