import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notification';
import { authMiddleware } from '../middleware';
import { sendResponse } from '../utils/response';
import logger from '../utils/logger';

const router = Router();

// All routes protected
router.use(authMiddleware);

// ============================================
// NOTIFICATION ROUTES (Protected)
// ============================================

/**
 * GET /api/v1/notifications
 * Get user notifications
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = (req as any).user.userId;

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(page as string) || 1,
      parseInt(limit as string) || 20,
      unreadOnly === 'true'
    );

    sendResponse(res, 200, 'Notifications fetched', result);
  } catch (error: any) {
    logger.error('Error fetching notifications:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch notifications');
  }
});

/**
 * GET /api/v1/notifications/unread-count
 * Get unread notification count
 */
router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const count = await notificationService.getUnreadCount(userId);

    sendResponse(res, 200, 'Unread count fetched', { count });
  } catch (error: any) {
    logger.error('Error fetching unread count:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch count');
  }
});

/**
 * PUT /api/v1/notifications/:notificationId/read
 * Mark notification as read
 */
router.put('/:notificationId/read', async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = (req as any).user.userId;

    const notification = await notificationService.markAsRead(userId, notificationId);

    sendResponse(res, 200, 'Notification marked as read', notification);
  } catch (error: any) {
    logger.error('Error marking notification as read:', error);
    sendResponse(res, 400, error.message || 'Failed to mark as read');
  }
});

/**
 * PUT /api/v1/notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const result = await notificationService.markAllAsRead(userId);

    sendResponse(res, 200, 'All marked as read', result);
  } catch (error: any) {
    logger.error('Error marking all as read:', error);
    sendResponse(res, 400, error.message || 'Failed to mark all as read');
  }
});

/**
 * DELETE /api/v1/notifications/:notificationId
 * Delete notification
 */
router.delete('/:notificationId', async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = (req as any).user.userId;

    await notificationService.deleteNotification(userId, notificationId);

    sendResponse(res, 200, 'Notification deleted');
  } catch (error: any) {
    logger.error('Error deleting notification:', error);
    sendResponse(res, 400, error.message || 'Failed to delete notification');
  }
});

export default router;
