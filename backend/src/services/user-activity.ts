import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userActivityService = {
  // WATCHLIST
  async addToWatchlist(userId: string, movieId: string): Promise<any> {
    return prisma.watchlist.upsert({
      where: {
        userId_movieId: { userId, movieId },
      },
      update: {},
      create: { userId, movieId },
    });
  },

  async removeFromWatchlist(userId: string, movieId: string): Promise<void> {
    await prisma.watchlist.deleteMany({
      where: { userId, movieId },
    });
  },

  async getWatchlist(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.watchlist.findMany({
        where: { userId },
        include: { movie: true },
        skip,
        take: limit,
        orderBy: { addedAt: 'desc' },
      }),
      prisma.watchlist.count({ where: { userId } }),
    ]);

    return {
      items: items.map((w) => w.movie),
      total,
      page,
      limit,
      hasMore: skip + items.length < total,
    };
  },

  // FAVORITES
  async addToFavorites(userId: string, entityId: string, entityType: string): Promise<any> {
    return prisma.favorite.upsert({
      where: {
        userId_entityId_entityType: { userId, entityId, entityType },
      },
      update: {},
      create: { userId, entityId, entityType },
    });
  },

  async removeFromFavorites(userId: string, entityId: string, entityType: string): Promise<void> {
    await prisma.favorite.deleteMany({
      where: { userId, entityId, entityType },
    });
  },

  async getFavorites(userId: string): Promise<any> {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' },
    });
  },

  // HISTORY
  async addToHistory(
    userId: string,
    entityId: string,
    entityType: string,
    progress: number,
    duration: number
  ): Promise<any> {
    // Create or update history entry
    const where: any = { userId, entityId, entityType };
    const data: any = {
      userId,
      entityId,
      entityType,
      progress,
      duration,
      watchedAt: new Date(),
    };

    // Add specific entity relations based on type
    if (entityType === 'movie') {
      data.movieId = entityId;
    } else if (entityType === 'short') {
      data.shortId = entityId;
    } else if (entityType === 'music') {
      data.musicId = entityId;
    }

    return prisma.history.upsert({
      where: { userId_entityId_entityType: where },
      update: data,
      create: data,
    });
  },

  async getHistory(userId: string, limit: number = 50): Promise<any> {
    return prisma.history.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: limit,
      include: {
        movie: { select: { id: true, title: true, posterUrl: true } },
        short: { select: { id: true, title: true, thumbnailUrl: true } },
        music: { select: { id: true, title: true, artist: true, coverUrl: true } },
      },
    });
  },

  async clearHistory(userId: string): Promise<void> {
    await prisma.history.deleteMany({
      where: { userId },
    });
  },

  // RATINGS & REVIEWS
  async addRating(
    userId: string,
    entityId: string,
    entityType: string,
    rating: number,
    comment?: string
  ): Promise<any> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const where: any = { userId_entityId_entityType: { userId, entityId, entityType } };
    const data: any = {
      userId,
      entityId,
      entityType,
      rating,
      comment,
    };

    if (entityType === 'movie') {
      data.movieId = entityId;
    } else if (entityType === 'short') {
      data.shortId = entityId;
    } else if (entityType === 'music') {
      data.musicId = entityId;
    }

    return prisma.rating.upsert({
      where,
      update: data,
      create: data,
    });
  },

  async removeRating(userId: string, entityId: string, entityType: string): Promise<void> {
    await prisma.rating.deleteMany({
      where: { userId, entityId, entityType },
    });
  },

  async getRatings(entityId: string): Promise<any> {
    return prisma.rating.findMany({
      where: { entityId },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getUserRating(userId: string, entityId: string, entityType: string): Promise<any> {
    return prisma.rating.findUnique({
      where: {
        userId_entityId_entityType: { userId, entityId, entityType },
      },
    });
  },
};
