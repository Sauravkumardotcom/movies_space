import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/notifications`,
  withCredentials: true,
});

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const notificationService = {
  /**
   * Get user notifications
   */
  async getUserNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
    const res = await API.get('/', {
      params: { page, limit, unreadOnly },
    });
    return res.data.data as NotificationsResponse;
  },

  /**
   * Get unread count
   */
  async getUnreadCount() {
    const res = await API.get('/unread-count');
    return res.data.data.count as number;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const res = await API.put(`/${notificationId}/read`);
    return res.data.data as Notification;
  },

  /**
   * Mark all as read
   */
  async markAllAsRead() {
    const res = await API.put('/read-all');
    return res.data;
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    const res = await API.delete(`/${notificationId}`);
    return res.data;
  },
};
