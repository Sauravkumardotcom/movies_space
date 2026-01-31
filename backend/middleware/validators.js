import { body, validationResult } from 'express-validator';

/**
 * Error handler middleware for validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for admin login
 */
export const validateAdminLogin = [
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 1 }).withMessage('Password cannot be empty'),
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
export const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 1 }).withMessage('Password cannot be empty'),
  handleValidationErrors
];

/**
 * Validation rules for email sending
 */
export const validateEmailRequest = [
  body('to')
    .trim()
    .notEmpty().withMessage('Recipient email is required')
    .isEmail().withMessage('Invalid recipient email address'),
  body('template')
    .trim()
    .notEmpty().withMessage('Email template is required')
    .isIn(['requestConfirmation', 'adminNotification', 'approved', 'rejected'])
    .withMessage('Invalid email template'),
  body('data')
    .notEmpty().withMessage('Email data is required')
    .isObject().withMessage('Email data must be an object'),
  handleValidationErrors
];

/**
 * Validation rules for video data
 */
export const validateVideoData = [
  body('title')
    .trim()
    .notEmpty().withMessage('Video title is required')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
  body('genre')
    .isArray().withMessage('Genre must be an array'),
  body('description')
    .trim()
    .optional()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('releaseYear')
    .optional()
    .isInt({ min: 1900, max: 2100 }).withMessage('Release year must be between 1900 and 2100'),
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(['movie', 'series', 'short']).withMessage('Type must be movie, series, or short'),
  handleValidationErrors
];

/**
 * Validation rules for search query
 */
export const validateSearchQuery = [
  body('query')
    .trim()
    .notEmpty().withMessage('Search query is required')
    .isLength({ min: 1, max: 255 }).withMessage('Search query must be between 1 and 255 characters'),
  handleValidationErrors
];

/**
 * Validation rules for Google Apps Script proxy
 */
export const validateAppsScriptRequest = [
  body('action')
    .trim()
    .notEmpty().withMessage('Action is required')
    .isIn(['getVideos', 'searchVideos', 'getTrendingVideos', 'getVideosByGenre', 'getGenres'])
    .withMessage('Invalid action'),
  handleValidationErrors
];
