export interface Music {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  streamUrl: string;
  coverUrl?: string;
  uploaderId?: string;
  plays: number;
  likes: number;
  createdAt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  songs: Music[];
  createdAt: string;
  updatedAt: string;
}

export interface PlayerState {
  currentSong: Music | null;
  isPlaying: boolean;
  queue: Music[];
  currentIndex: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeat: 'off' | 'one' | 'all';
  isShuffle: boolean;
}

export interface Upload {
  id: string;
  userId: string;
  title: string;
  duration: number;
  fileSize: number;
  mimeType: string;
  status: 'processing' | 'ready' | 'failed';
  streamUrl?: string;
  createdAt: string;
}
