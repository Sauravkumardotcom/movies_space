import { v4 as uuidv4 } from 'uuid';
import { Response, NextFunction } from 'express';
import { ApiResponse } from '@types/api';

export function generateRequestId(): string {
  return uuidv4();
}

export function createResponse<T>(
  statusCode: number,
  message: string,
  data?: T,
  errors?: Array<{ field?: string; message: string; code?: string }>,
  requestId?: string
): ApiResponse<T> {
  return {
    status: statusCode < 400 ? 'success' : 'error',
    statusCode,
    message,
    data,
    errors,
    requestId: requestId || generateRequestId(),
    timestamp: new Date().toISOString(),
  };
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  errors?: Array<{ field?: string; message: string; code?: string }>
): Response {
  const requestId = (res.locals.requestId as string) || generateRequestId();
  return res.status(statusCode).json(createResponse(statusCode, message, data, errors, requestId));
}

export function handleError(
  error: unknown,
  statusCode: number = 500,
  fallbackMessage: string = 'Internal server error'
): { statusCode: number; message: string; errors?: Array<{ message: string }> } {
  if (error instanceof Error) {
    return {
      statusCode,
      message: error.message || fallbackMessage,
    };
  }

  return {
    statusCode,
    message: fallbackMessage,
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Array<{ field?: string; message: string; code?: string }>
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
