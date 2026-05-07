import prisma from '../connection.js';

const normalizeVideoRecord = (video) => ({
  ...video,
  views: typeof video.views === 'bigint' ? Number(video.views) : video.views
});

const buildSearchFilter = ({ q, genre, language, minRating, director, year, status }) => {
  const filters = [];

  if (status) {
    filters.push({ status });
  }

  if (language) {
    filters.push({ language: { equals: language, mode: 'insensitive' } });
  }

  if (minRating) {
    const ratingValue = parseFloat(minRating);
    if (!Number.isNaN(ratingValue)) {
      filters.push({ rating: { gte: ratingValue } });
    }
  }

  if (director) {
    filters.push({ director: { contains: director, mode: 'insensitive' } });
  }

  if (year) {
    const yearNumber = parseInt(year, 10);
    if (!Number.isNaN(yearNumber)) {
      const start = new Date(yearNumber, 0, 1);
      const end = new Date(yearNumber + 1, 0, 1);
      filters.push({ releaseDate: { gte: start, lt: end } });
    }
  }

  if (genre) {
    const genres = Array.isArray(genre)
      ? genre.map((item) => item.trim()).filter(Boolean)
      : String(genre).split(',').map((item) => item.trim()).filter(Boolean);

    if (genres.length === 1) {
      filters.push({ genre: { has: genres[0] } });
    } else if (genres.length > 1) {
      filters.push({ genre: { hasSome: genres } });
    }
  }

  if (q) {
    filters.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { genre: { has: q } },
        { tags: { has: q } }
      ]
    });
  }

  return filters.length ? { AND: filters } : {};
};

const buildOrderBy = (sortBy, order) => {
  const direction = order === 'asc' ? 'asc' : 'desc';
  const sortMap = {
    views: { views: direction },
    rating: { rating: direction },
    date: { createdAt: direction },
    title: { title: direction },
    trending: { views: direction }
  };
  return sortMap[sortBy] || sortMap.date;
};

export const searchVideos = async (queryOptions, page = 1, limit = 20, sortBy = 'date', order = 'desc') => {
  const paginationLimit = Math.min(Math.max(limit, 1), 100);
  const offset = (Math.max(page, 1) - 1) * paginationLimit;
  const where = buildSearchFilter(queryOptions);
  const orderBy = buildOrderBy(sortBy, order);

  const [total, videos] = await Promise.all([
    prisma.video.count({ where }),
    prisma.video.findMany({
      where,
      include: {
        uploadedBy: {
          select: { id: true, email: true, username: true, avatar: true }
        }
      },
      orderBy,
      skip: offset,
      take: paginationLimit
    })
  ]);

  return {
    success: true,
    data: videos.map(normalizeVideoRecord),
    total,
    page: Math.max(page, 1),
    limit: paginationLimit,
    totalPages: Math.ceil(total / paginationLimit),
    hasMore: Math.max(page, 1) * paginationLimit < total
  };
};

export const getTrendingVideos = async (limit = 10, genre) => {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const where = {
    status: 'approved',
    isPublic: true,
    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  };

  if (genre) {
    where.genre = { has: genre };
  }

  const videos = await prisma.video.findMany({
    where,
    include: {
      uploadedBy: {
        select: { id: true, email: true, username: true, avatar: true }
      }
    },
    orderBy: { views: 'desc' },
    take: safeLimit
  });

  return videos.map(normalizeVideoRecord);
};

export const getVideosByGenre = async (genre, page = 1, limit = 20, sortBy = 'date', order = 'desc') => {
  return await searchVideos({ genre, status: 'approved' }, page, limit, sortBy, order);
};

export const getVideoById = async (id) => {
  const video = await prisma.video.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: {
      uploadedBy: {
        select: { id: true, email: true, username: true, avatar: true }
      }
    }
  });
  return video ? normalizeVideoRecord(video) : null;
};

export const createVideo = async (videoData) => {
  const {
    title,
    description,
    url,
    poster = null,
    thumbnail = null,
    duration = null,
    genre = [],
    rating = null,
    director = null,
    cast = [],
    language = 'en',
    uploadedBy,
    status = 'pending',
    metadata = {},
    isPublic = true,
    tags = []
  } = videoData;

  const video = await prisma.video.create({
    data: {
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
      uploadedById: uploadedBy,
      status,
      metadata,
      isPublic,
      tags
    },
    include: {
      uploadedBy: {
        select: { id: true, email: true, username: true, avatar: true }
      }
    }
  });

  return normalizeVideoRecord(video);
};

export const getRecommendedVideos = async (genre, limit = 10) => {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const where = {
    status: 'approved',
    isPublic: true
  };

  if (genre) {
    where.genre = { has: genre };
  }

  const videos = await prisma.video.findMany({
    where,
    include: {
      uploadedBy: {
        select: { id: true, email: true, username: true, avatar: true }
      }
    },
    orderBy: [{ views: 'desc' }, { rating: 'desc' }],
    take: safeLimit
  });

  return videos.map(normalizeVideoRecord);
};
