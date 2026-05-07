import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { validateVideoData } from '../middleware/validators.js';
import { searchVideos, getTrendingVideos, getVideosByGenre, getVideoById, createVideo, getRecommendedVideos } from '../db/repositories/videos.js';

const router = express.Router();

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

    const result = await searchVideos(
      { q, genre, language, minRating, director, year, status: 'approved' },
      Number(page),
      Number(limit),
      sortBy,
      order
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('Search videos error:', error);
    return res.status(500).json({ success: false, message: 'Search failed', error: error.message });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const genre = req.query.genre;

    const videos = await getTrendingVideos(limit, genre);
    return res.status(200).json({ success: true, data: videos, total: videos.length });
  } catch (error) {
    console.error('Trending videos error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch trending videos', error: error.message });
  }
});

router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20, sortBy = 'date', order = 'desc' } = req.query;

    const result = await getVideosByGenre(genre, Number(page), Number(limit), sortBy, order);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Genre videos error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch videos by genre', error: error.message });
  }
});

router.get('/recommendations/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const recommendations = await getRecommendedVideos(genre, limit);

    return res.status(200).json({ success: true, data: recommendations, total: recommendations.length });
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recommendations', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await getVideoById(id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    return res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error('Get video error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch video', error: error.message });
  }
});

router.post('/', protectRoute, validateVideoData, async (req, res) => {
  try {
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
      language = 'en',
      subtitle,
      quality,
      status = 'pending',
      isPublic = true,
      tags = [],
      metadata = {}
    } = req.body;

    const video = await createVideo({
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
      language,
      subtitle,
      quality,
      uploadedBy: req.user.userId,
      status,
      metadata,
      isPublic,
      tags
    });

    return res.status(201).json({ success: true, message: 'Video created successfully', data: video });
  } catch (error) {
    console.error('Create video error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create video', error: error.message });
  }
});

router.get('/recommendations/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const recommendations = await getRecommendedVideos(genre, limit);

    return res.status(200).json({ success: true, data: recommendations, total: recommendations.length });
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recommendations', error: error.message });
  }
});

export default router;
