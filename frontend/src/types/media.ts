export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  streamUrl?: string;
  genre: string[];
  year: number;
  director: string;
  rating: number;
  duration: number;
  type: 'movie' | 'tv';
  createdAt: string;
}

export interface Episode {
  id: string;
  showId: string;
  title: string;
  season: number;
  episode: number;
  duration: number;
  streamUrl: string;
  airDate: string;
}

export interface Short {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  creatorId: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface MovieFilters {
  genre?: string;
  year?: number;
  type?: 'movie' | 'tv';
  page?: number;
  limit?: number;
}
