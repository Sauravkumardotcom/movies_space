import { User } from './auth';
import { Movie } from './media';
import { Music } from './music';

export interface Watchlist {
  id: string;
  userId: string;
  movieId: string;
  movie?: Movie;
  addedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  entityId: string;
  entityType: 'movie' | 'music' | 'short';
  addedAt: string;
}

export interface HistoryEntry {
  id: string;
  userId: string;
  entityId: string;
  entityType: 'movie' | 'music' | 'short';
  watchedAt: string;
  progress: number;
  duration: number;
}

export interface Rating {
  id: string;
  userId: string;
  entityId: string;
  entityType: 'movie' | 'music' | 'short';
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  watchlist: Watchlist[];
  favorites: Favorite[];
  history: HistoryEntry[];
}
