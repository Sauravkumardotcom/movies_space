import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

// ============================================
// NOTIFICATION SERVICE
// ============================================

export const notificationService = {
  /**
   * Create a notification
   */
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    relatedEntityId?: string
  ) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          relatedEntityId,
        },
      });

      logger.info(`Notification created: ${notification.id}`);
      return notification;
    } catch (error: any) {
      logger.error('Error creating notification:', error);
      throw new Error(error.message || 'Failed to create notification');
    }
  },

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
    try {
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: {
            userId,
            ...(unreadOnly && { isRead: false }),
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.notification.count({
          where: {
            userId,
            ...(unreadOnly && { isRead: false }),
          },
        }),
      ]);

      return {
        data: notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      logger.error('Error fetching notifications:', error);
      throw new Error(error.message || 'Failed to fetch notifications');
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification || notification.userId !== userId) {
        throw new Error('Notification not found');
      }

      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      logger.info(`Notification marked as read: ${notificationId}`);
      return updated;
    } catch (error: any) {
      logger.error('Error marking notification as read:', error);
      throw new Error(error.message || 'Failed to mark as read');
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    try {
      const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      logger.info(`Marked ${result.count} notifications as read`);
      return result;
    } catch (error: any) {
      logger.error('Error marking all as read:', error);
      throw new Error(error.message || 'Failed to mark all as read');
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification || notification.userId !== userId) {
        throw new Error('Notification not found');
      }

      await prisma.notification.delete({
        where: { id: notificationId },
      });

      logger.info(`Notification deleted: ${notificationId}`);
    } catch (error: any) {
      logger.error('Error deleting notification:', error);
      throw new Error(error.message || 'Failed to delete notification');
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      return count;
    } catch (error: any) {
      logger.error('Error fetching unread count:', error);
      throw new Error(error.message || 'Failed to fetch unread count');
    }
  },

  /**
   * Notify followers (e.g., when user uploads new content)
   */
  async notifyFollowers(userId: string, type: string, title: string, message: string) {
    try {
      // Get all followers
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        select: { followerId: true },
      });

      if (followers.length === 0) {
        return { count: 0 };
      }

      // Create notifications for each follower
      const result = await prisma.notification.createMany({
        data: followers.map((f) => ({
          userId: f.followerId,
          type,
          title,
          message,
        })),
        skipDuplicates: true,
      });

      logger.info(`Notified ${result.count} followers`);
      return result;
    } catch (error: any) {
      logger.error('Error notifying followers:', error);
      throw new Error(error.message || 'Failed to notify followers');
    }
  },
};
