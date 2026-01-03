import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api/v1/notifications`;

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  read_at?: string;
}

const getNotifications = async (unreadOnly: boolean = false): Promise<Notification[]> => {
  const token = localStorage.getItem('jwt');
  const response = await axios.get(API_URL, {
    params: { unread_only: unreadOnly },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getUnreadCount = async (): Promise<number> => {
  const token = localStorage.getItem('jwt');
  const response = await axios.get(`${API_URL}/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.count;
};

const markAsRead = async (notificationId: number): Promise<void> => {
  const token = localStorage.getItem('jwt');
  await axios.post(
    `${API_URL}/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const markAllAsRead = async (): Promise<number> => {
  const token = localStorage.getItem('jwt');
  const response = await axios.post(
    `${API_URL}/mark-all-read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.count;
};

const deleteNotification = async (notificationId: number): Promise<void> => {
  const token = localStorage.getItem('jwt');
  await axios.delete(`${API_URL}/${notificationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
