export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl?: string;
  trailerUrl?: string;
  genre: string[];
  year: number;
  director: string;
  rating: number;
  duration: number;
  type: 'movie' | 'tv';
  createdAt: string;
}

export interface Music {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number;
  streamUrl: string;
  coverUrl?: string;
  uploaderId?: string;
  plays: number;
  likes: number;
  createdAt: string;
}

export interface Short {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  creatorId: string;
  likes: number;
  views: number;
  createdAt: string;
}
