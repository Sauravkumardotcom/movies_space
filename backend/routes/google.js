import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * @route   POST /api/google/sheets/add-video
 * @desc    Add a video to Google Sheets
 * @access  Public (calls Google Apps Script Web App)
 * @body    {string} title - Video title
 * @body    {string} description - Video description
 * @body    {string} url - Video URL
 * @body    {string} genre - Video genre
 * @body    {number} rating - Video rating
 * @body    {string} director - Director name
 * @returns {Object} Response from Google Sheets
 */
router.post('/sheets/add-video', async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      genre,
      rating,
      director,
      language = 'en',
      year = new Date().getFullYear()
    } = req.body;

    // Validation
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Title and URL are required'
      });
    }

    const googleAppsScriptUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!googleAppsScriptUrl) {
      return res.status(500).json({
        success: false,
        message: 'Google Apps Script URL not configured'
      });
    }

    // Call Google Apps Script
    const response = await axios.post(googleAppsScriptUrl, {
      action: 'addVideo',
      data: {
        title,
        description,
        url,
        genre,
        rating,
        director,
        language,
        year,
        timestamp: new Date().toISOString()
      }
    }, {
      timeout: 10000
    });

    // Check if Google Apps Script returned success
    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: 'Video added to Google Sheets successfully',
        data: response.data.data || {},
        sheetUrl: response.data.sheetUrl
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.message || 'Failed to add video to Google Sheets',
        details: response.data.details
      });
    }
  } catch (error) {
    console.error('Add video to Sheets error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Request timeout - Google Apps Script took too long to respond'
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied - Check Google Apps Script deployment'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add video to Google Sheets',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/google/sheets/videos
 * @desc    Get all videos from Google Sheets
 * @access  Public
 * @query   {number} limit - Number of results (optional)
 * @returns {Object} Array of videos from Google Sheets
 */
router.get('/sheets/videos', async (req, res) => {
  try {
    const { limit } = req.query;

    const googleAppsScriptUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!googleAppsScriptUrl) {
      return res.status(500).json({
        success: false,
        message: 'Google Apps Script URL not configured'
      });
    }

    // Call Google Apps Script to fetch videos
    const response = await axios.post(googleAppsScriptUrl, {
      action: 'getVideos',
      limit: limit ? parseInt(limit) : undefined
    }, {
      timeout: 10000
    });

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        data: response.data.data || [],
        total: response.data.total || 0,
        source: 'Google Sheets'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.message || 'Failed to fetch videos from Google Sheets'
      });
    }
  } catch (error) {
    console.error('Get videos from Sheets error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Request timeout - Google Apps Script took too long to respond'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch videos from Google Sheets',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/google/sheets/sync
 * @desc    Sync videos between MongoDB and Google Sheets
 * @access  Public
 * @body    {string} direction - 'mongo-to-sheets' or 'sheets-to-mongo'
 * @returns {Object} Sync operation result
 */
router.post('/sheets/sync', async (req, res) => {
  try {
    const { direction = 'mongo-to-sheets' } = req.body;

    const googleAppsScriptUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!googleAppsScriptUrl) {
      return res.status(500).json({
        success: false,
        message: 'Google Apps Script URL not configured'
      });
    }

    // Call Google Apps Script for sync
    const response = await axios.post(googleAppsScriptUrl, {
      action: 'syncVideos',
      direction,
      timestamp: new Date().toISOString()
    }, {
      timeout: 30000
    });

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: `Sync operation completed (${direction})`,
        data: response.data.data || {},
        itemsSynced: response.data.itemsSynced || 0
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.message || 'Sync operation failed'
      });
    }
  } catch (error) {
    console.error('Sync error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to execute sync operation',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/google/status
 * @desc    Check Google Apps Script and Sheets status
 * @access  Public
 * @returns {Object} Status of Google integration
 */
router.get('/status', async (req, res) => {
  try {
    const googleAppsScriptUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    
    if (!googleAppsScriptUrl) {
      return res.status(200).json({
        success: false,
        message: 'Google Apps Script URL not configured',
        configured: false
      });
    }

    // Test connection to Google Apps Script
    const startTime = Date.now();
    try {
      const response = await axios.post(googleAppsScriptUrl, {
        action: 'ping'
      }, {
        timeout: 5000
      });
      const responseTime = Date.now() - startTime;

      return res.status(200).json({
        success: true,
        message: 'Google Apps Script is accessible',
        configured: true,
        responseTime,
        status: response.data.status || 'connected',
        appScriptUrl: googleAppsScriptUrl.substring(0, 50) + '...'
      });
    } catch (pingError) {
      return res.status(200).json({
        success: false,
        message: 'Google Apps Script is not responding',
        configured: true,
        error: pingError.message,
        appScriptUrl: googleAppsScriptUrl.substring(0, 50) + '...'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking Google status',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/google/sheets/clear
 * @desc    Clear all data from Google Sheets (for testing)
 * @access  Public
 * @returns {Object} Clear operation result
 */
router.post('/sheets/clear', async (req, res) => {
  try {
    const googleAppsScriptUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!googleAppsScriptUrl) {
      return res.status(500).json({
        success: false,
        message: 'Google Apps Script URL not configured'
      });
    }

    // Call Google Apps Script to clear data
    const response = await axios.post(googleAppsScriptUrl, {
      action: 'clearSheets'
    }, {
      timeout: 10000
    });

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: 'Google Sheets cleared successfully',
        rowsCleared: response.data.rowsCleared || 0
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.message || 'Failed to clear Google Sheets'
      });
    }
  } catch (error) {
    console.error('Clear Sheets error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to clear Google Sheets',
      error: error.message
    });
  }
});

export default router;
