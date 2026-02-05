import { Request, Response, NextFunction } from 'express';
import { generateRequestId, sendResponse } from '@utils/response';
import { verifyAccessToken } from '@utils/auth';
import type { AuthRequest } from '@types/express';
import logger from '@utils/logger';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = generateRequestId();
  res.locals.requestId = requestId;
  logger.info(`[${requestId}] ${req.method} ${req.path}`);
  next();
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendResponse(res, 401, 'Missing or invalid authorization header');
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      sendResponse(res, 401, 'Invalid or expired token');
      return;
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    sendResponse(res, 500, 'Authentication failed');
  }
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Error:', error);

  if (error instanceof Error) {
    sendResponse(res, 500, error.message || 'Internal server error');
  } else {
    sendResponse(res, 500, 'Internal server error');
  }
}
