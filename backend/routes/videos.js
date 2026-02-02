import express from 'express';
import { Video } from '../db/models/index.js';
import {
  buildSearchFilter,
  parseSortOptions,
  parsePagination,
  buildAggregationPipeline,
  formatSearchResults,
  getTrendingVideos,
  getRecommendedVideos
} from '../utils/search.js';

const router = express.Router();

/**
 * @route   GET /api/videos
 * @desc    Search videos with full-text search and filters
 * @access  Public
 * @query   {string} q - Search query (full-text search)
 * @query   {string} genre - Filter by genre(s) - comma separated
 * @query   {string} language - Filter by language
 * @query   {number} minRating - Minimum rating (0-10)
 * @query   {string} director - Filter by director name
 * @query   {number} year - Filter by release year
 * @query   {string} sortBy - Sort by (views, rating, date, title, trending)
 * @query   {string} order - Sort order (asc, desc) - default: desc
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Results per page (default: 20, max: 100)
 * @returns {Object} Array of videos with pagination info
 */
router.get('/', async (req, res) => {
  try {
    const {
      q,
      genre,
      language,
      minRating,
      director,
      year,
      sortBy = 'date',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter from query parameters
    const filter = buildSearchFilter(req.query);

    // Parse sort options
    const sort = parseSortOptions(sortBy, order);

    // Parse pagination
    const pagination = parsePagination(page, limit);

    // Build aggregation pipeline
    const pipeline = buildAggregationPipeline(filter, sort, pagination);

    // Execute aggregation
    const result = await Video.aggregate(pipeline);

    // Format and return results
    const formattedResult = formatSearchResults(result, pagination);

    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error('Search videos error:', error);

    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/videos/trending
 * @desc    Get trending videos (most viewed in last 30 days)
 * @access  Public
 * @query   {number} limit - Number of results (default: 10, max: 50)
 * @query   {string} genre - Filter by genre (optional)
 * @returns {Object} Array of trending videos
 */
router.get('/trending', async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const genre = req.query.genre;

    let pipeline = [
      {
        $match: {
          status: 'approved',
          isPublic: true,
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }
    ];

    // Add genre filter if provided
    if (genre) {
      pipeline[0].$match.genre = { $in: [genre] };
    }

    pipeline.push(
      { $sort: { views: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'uploadedBy',
          foreignField: '_id',
          as: 'uploader'
        }
      },
      {
        $unwind: {
          path: '$uploader',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          poster: 1,
          thumbnail: 1,
          genre: 1,
          rating: 1,
          views: 1,
          duration: 1,
          'uploader._id': 1,
          'uploader.username': 1,
          'uploader.avatar': 1,
          createdAt: 1
        }
      }
    );

    const trending = await Video.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: trending,
      total: trending.length
    });
  } catch (error) {
    console.error('Trending videos error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch trending videos',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/videos/genre/:genre
 * @desc    Get videos by specific genre
 * @access  Public
 * @param   {string} genre - Genre name
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Results per page (default: 20)
 * @query   {string} sortBy - Sort by (views, rating, date)
 * @returns {Object} Array of videos filtered by genre
 */
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20, sortBy = 'date', order = 'desc' } = req.query;

    const pagination = parsePagination(page, limit);
    const sort = parseSortOptions(sortBy, order);

    const pipeline = [
      {
        $match: {
          genre: genre,
          status: 'approved',
          isPublic: true
        }
      },
      { $sort: sort },
      {
        $facet: {
          total: [{ $count: 'count' }],
          results: [
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            {
              $lookup: {
                from: 'users',
                localField: 'uploadedBy',
                foreignField: '_id',
                as: 'uploader'
              }
            },
            {
              $unwind: {
                path: '$uploader',
                preserveNullAndEmptyArrays: true
              }
            }
          ]
        }
      }
    ];

    const result = await Video.aggregate(pipeline);
    const formattedResult = formatSearchResults(result, pagination);

    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error('Genre videos error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch videos by genre',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/videos/:id
 * @desc    Get single video by ID (increment views)
 * @access  Public
 * @param   {string} id - Video ID
 * @returns {Object} Video details with uploader info
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find video and increment views
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploadedBy', 'username email avatar -password');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Get video error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/videos
 * @desc    Create a new video (upload)
 * @access  Protected (authenticated users)
 * @body    {string} title - Video title (required)
 * @body    {string} description - Video description
 * @body    {string} url - Video URL (required)
 * @body    {string} poster - Poster image URL
 * @body    {string} thumbnail - Thumbnail image URL
 * @body    {number} duration - Video duration in seconds
 * @body    {array} genre - Video genres
 * @body    {number} rating - Video rating (0-10)
 * @body    {string} director - Director name
 * @body    {array} cast - Cast array
 * @body    {string} language - Video language (default: en)
 * @returns {Object} Created video object
 */
router.post('/', async (req, res) => {
  try {
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to upload videos'
      });
    }

    const {
      title,
      description,
      url,
      poster,
      thumbnail,
      duration,
      genre,
      rating,
      director,
      cast,
      language = 'en'
    } = req.body;

    // Validation
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Title and URL are required'
      });
    }

    // Extract userId from token (would be set by middleware in production)
    // For now, return instruction to use auth middleware
    return res.status(400).json({
      success: false,
      message: 'Video upload endpoint requires JWT auth middleware to extract userId'
    });
  } catch (error) {
    console.error('Create video error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create video',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/videos/recommendations/:genre
 * @desc    Get recommended videos based on genre
 * @access  Public
 * @param   {string} genre - Genre name
 * @query   {number} limit - Number of results (default: 10)
 * @returns {Object} Array of recommended videos
 */
router.get('/recommendations/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const recommendations = await getRecommendedVideos(Video, [genre], limit);

    return res.status(200).json({
      success: true,
      data: recommendations,
      total: recommendations.length
    });
  } catch (error) {
    console.error('Recommendations error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

export default router;
