/**
 * Search utility functions for MongoDB queries
 * Handles full-text search, filtering, sorting, and pagination
 */

/**
 * Parse search query parameters and build MongoDB filter
 * @param {Object} query - Query parameters from request
 * @returns {Object} MongoDB filter object
 */
export const buildSearchFilter = (query) => {
  const filter = {};

  // Full-text search
  if (query.q) {
    filter.$text = { $search: query.q };
  }

  // Genre filter
  if (query.genre) {
    const genres = Array.isArray(query.genre)
      ? query.genre
      : query.genre.split(',').map(g => g.trim());
    
    if (genres.length > 0) {
      filter.genre = { $in: genres };
    }
  }

  // Language filter
  if (query.language) {
    filter.language = query.language.toLowerCase();
  }

  // Rating filter (minimum rating)
  if (query.minRating) {
    const rating = parseFloat(query.minRating);
    if (!isNaN(rating)) {
      filter.rating = { $gte: rating };
    }
  }

  // Status filter
  if (query.status) {
    const statuses = Array.isArray(query.status)
      ? query.status
      : [query.status];
    filter.status = { $in: statuses };
  }

  // Date range filter
  if (query.fromDate || query.toDate) {
    filter.createdAt = {};
    if (query.fromDate) {
      const fromDate = new Date(query.fromDate);
      if (!isNaN(fromDate.getTime())) {
        filter.createdAt.$gte = fromDate;
      }
    }
    if (query.toDate) {
      const toDate = new Date(query.toDate);
      if (!isNaN(toDate.getTime())) {
        filter.createdAt.$lte = toDate;
      }
    }
  }

  // Public videos only
  if (query.public === 'true' || query.public === true) {
    filter.isPublic = true;
  }

  // Director filter
  if (query.director) {
    filter.director = new RegExp(query.director, 'i');
  }

  // Released year
  if (query.year) {
    const year = parseInt(query.year);
    if (!isNaN(year)) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      filter.releaseDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
  }

  return filter;
};

/**
 * Parse sort parameters
 * @param {string} sortBy - Sort field (views, rating, date, title)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Object} MongoDB sort object
 */
export const parseSortOptions = (sortBy, order) => {
  const validSortFields = {
    views: 'views',
    rating: 'rating',
    date: 'createdAt',
    title: 'title',
    releaseDate: 'releaseDate',
    trending: 'views' // Treat trending as views
  };

  const sortField = validSortFields[sortBy] || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  return {
    [sortField]: sortOrder
  };
};

/**
 * Parse pagination parameters
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20, max: 100)
 * @returns {Object} Skip and limit values
 */
export const parsePagination = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  return {
    skip,
    limit: limitNum,
    page: pageNum
  };
};

/**
 * Build aggregation pipeline for advanced searches
 * @param {Object} filter - MongoDB filter
 * @param {Object} sort - Sort options
 * @param {Object} pagination - Pagination options
 * @returns {Array} MongoDB aggregation pipeline
 */
export const buildAggregationPipeline = (filter, sort, pagination) => {
  const pipeline = [];

  // Match stage
  if (Object.keys(filter).length > 0) {
    pipeline.push({ $match: filter });
  }

  // Add score for text search results
  if (filter.$text) {
    pipeline.push({
      $addFields: {
        textScore: { $meta: 'textScore' }
      }
    });

    // Sort by text score first if doing text search
    pipeline.push({
      $sort: { textScore: -1, ...sort }
    });
  } else {
    // Regular sort
    if (Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }
  }

  // Lookup for user details (populate uploadedBy)
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'uploadedBy',
      foreignField: '_id',
      as: 'uploader'
    }
  });

  pipeline.push({
    $unwind: {
      path: '$uploader',
      preserveNullAndEmptyArrays: true
    }
  });

  // Project to include uploader info but exclude password
  pipeline.push({
    $project: {
      title: 1,
      description: 1,
      url: 1,
      poster: 1,
      thumbnail: 1,
      duration: 1,
      genre: 1,
      rating: 1,
      releaseDate: 1,
      director: 1,
      cast: 1,
      language: 1,
      subtitle: 1,
      quality: 1,
      uploadedBy: 1,
      views: 1,
      status: 1,
      metadata: 1,
      isPublic: 1,
      tags: 1,
      createdAt: 1,
      updatedAt: 1,
      'uploader._id': 1,
      'uploader.email': 1,
      'uploader.username': 1,
      'uploader.avatar': 1
    }
  });

  // Facet stage for total count
  pipeline.push({
    $facet: {
      total: [{ $count: 'count' }],
      results: [
        { $skip: pagination.skip },
        { $limit: pagination.limit }
      ]
    }
  });

  return pipeline;
};

/**
 * Format search results with metadata
 * @param {Array} aggregationResult - Result from aggregation pipeline
 * @param {Object} pagination - Pagination info
 * @returns {Object} Formatted results with total count and pagination info
 */
export const formatSearchResults = (aggregationResult, pagination) => {
  const [result] = aggregationResult;

  if (!result) {
    return {
      success: true,
      data: [],
      total: 0,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: 0
    };
  }

  const total = result.total[0]?.count || 0;
  const totalPages = Math.ceil(total / pagination.limit);

  return {
    success: true,
    data: result.results,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages,
    hasMore: pagination.page < totalPages
  };
};

/**
 * Get trending videos (most views in last 30 days)
 * @param {Object} Model - Video model
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Trending videos
 */
export const getTrendingVideos = async (VideoModel, limit = 10) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const trending = await VideoModel.aggregate([
    {
      $match: {
        status: 'approved',
        isPublic: true,
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $sort: { views: -1 }
    },
    {
      $limit: limit
    },
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
  ]);

  return trending;
};

/**
 * Get recommended videos based on genre
 * @param {Object} VideoModel - Video model
 * @param {Array} genres - Genre array
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Recommended videos
 */
export const getRecommendedVideos = async (VideoModel, genres = [], limit = 10) => {
  const recommendations = await VideoModel.aggregate([
    {
      $match: {
        status: 'approved',
        isPublic: true,
        genre: genres.length > 0 ? { $in: genres } : { $exists: true }
      }
    },
    {
      $sort: { views: -1, rating: -1 }
    },
    {
      $limit: limit
    },
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
  ]);

  return recommendations;
};
