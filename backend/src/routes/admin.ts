import { Router, Request, Response } from 'express';
import { adminService } from '../services/admin';
import { authMiddleware } from '../middleware';
import { sendResponse } from '../utils/response';
import logger from '../utils/logger';

const router = Router();

// Admin middleware check
const adminMiddleware = async (req: Request, res: Response, next: any) => {
  try {
    const user = (req as any).user;
    if (!user || !user.isAdmin) {
      return sendResponse(res, 403, 'Admin access required');
    }
    next();
  } catch (error) {
    sendResponse(res, 403, 'Unauthorized');
  }
};

// All routes protected
router.use(authMiddleware);

// ============================================
// ADMIN ROUTES (Protected + Admin Only)
// ============================================

/**
 * GET /api/v1/admin/users
 * Get all users (admin only)
 */
router.get('/users', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const result = await adminService.getAllUsers(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 20
    );

    sendResponse(res, 200, 'Users fetched', result);
  } catch (error: any) {
    logger.error('Error fetching users:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch users');
  }
});

/**
 * GET /api/v1/admin/users/:userId/stats
 * Get user stats (admin only)
 */
router.get('/users/:userId/stats', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const stats = await adminService.getUserStats(userId);

    sendResponse(res, 200, 'User stats fetched', stats);
  } catch (error: any) {
    logger.error('Error fetching user stats:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch stats');
  }
});

/**
 * GET /api/v1/admin/platform/stats
 * Get platform stats (admin only)
 */
router.get('/platform/stats', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getPlatformStats();

    sendResponse(res, 200, 'Platform stats fetched', stats);
  } catch (error: any) {
    logger.error('Error fetching platform stats:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch stats');
  }
});

/**
 * POST /api/v1/admin/users/:userId/ban
 * Ban a user (admin only)
 */
router.post('/users/:userId/ban', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const ban = await adminService.banUser(userId, reason);

    sendResponse(res, 201, 'User banned', ban);
  } catch (error: any) {
    logger.error('Error banning user:', error);
    sendResponse(res, 400, error.message || 'Failed to ban user');
  }
});

/**
 * DELETE /api/v1/admin/users/:userId/ban
 * Unban a user (admin only)
 */
router.delete('/users/:userId/ban', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await adminService.unbanUser(userId);

    sendResponse(res, 200, 'User unbanned');
  } catch (error: any) {
    logger.error('Error unbanning user:', error);
    sendResponse(res, 400, error.message || 'Failed to unban user');
  }
});

/**
 * DELETE /api/v1/admin/comments/:commentId
 * Delete comment (admin only)
 */
router.delete('/comments/:commentId', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    await adminService.deleteCommentAdmin(commentId, reason);

    sendResponse(res, 200, 'Comment deleted');
  } catch (error: any) {
    logger.error('Error deleting comment:', error);
    sendResponse(res, 400, error.message || 'Failed to delete comment');
  }
});

/**
 * GET /api/v1/admin/moderation-logs
 * Get moderation logs (admin only)
 */
router.get('/moderation-logs', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const result = await adminService.getModerationLogs(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 20
    );

    sendResponse(res, 200, 'Moderation logs fetched', result);
  } catch (error: any) {
    logger.error('Error fetching moderation logs:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch logs');
  }
});

/**
 * POST /api/v1/admin/reports
 * Report content (protected, all users)
 */
router.post('/reports', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contentId, contentType, reason } = req.body;
    const userId = (req as any).user.userId;

    const report = await adminService.reportContent(userId, contentId, contentType, reason);

    sendResponse(res, 201, 'Content reported', report);
  } catch (error: any) {
    logger.error('Error reporting content:', error);
    sendResponse(res, 400, error.message || 'Failed to report content');
  }
});

/**
 * GET /api/v1/admin/reports
 * Get reports (admin only)
 */
router.get('/reports', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const result = await adminService.getReports(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 20,
      status as string | undefined
    );

    sendResponse(res, 200, 'Reports fetched', result);
  } catch (error: any) {
    logger.error('Error fetching reports:', error);
    sendResponse(res, 400, error.message || 'Failed to fetch reports');
  }
});

/**
 * PUT /api/v1/admin/reports/:reportId
 * Resolve report (admin only)
 */
router.put('/reports/:reportId', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { action, notes } = req.body;

    const report = await adminService.resolveReport(reportId, action, notes);

    sendResponse(res, 200, 'Report resolved', report);
  } catch (error: any) {
    logger.error('Error resolving report:', error);
    sendResponse(res, 400, error.message || 'Failed to resolve report');
  }
});

export default router;
