import { create } from 'zustand';
import type { Music } from '../services/music';

// ============================================
// TYPES
// ============================================

export interface AudioPlayerState {
  // Current track
  currentTrack: Music | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  // Queue
  queue: Music[];
  queueIndex: number;

  // Controls
  setCurrentTrack: (track: Music | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  // Queue management
  addToQueue: (track: Music) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setQueue: (tracks: Music[]) => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;

  // Volume (future enhancement)
  volume: number;
  setVolume: (volume: number) => void;
}

// ============================================
// STORE
// ============================================

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  queueIndex: 0,
  volume: 100,

  // Track control
  setCurrentTrack: (track) => {
    set({
      currentTrack: track,
      currentTime: 0,
      isPlaying: !!track, // Auto-play when setting track
    });
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  // Queue management
  addToQueue: (track) => {
    set((state) => ({
      queue: [...state.queue, track],
    }));
  },

  removeFromQueue: (index) => {
    set((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      return {
        queue: newQueue,
        // Adjust queueIndex if needed
        queueIndex:
          state.queueIndex >= newQueue.length
            ? Math.max(0, newQueue.length - 1)
            : state.queueIndex,
      };
    });
  },

  clearQueue: () => {
    set({ queue: [], queueIndex: 0 });
  },

  setQueue: (tracks) => {
    set({ queue: tracks, queueIndex: 0 });
  },

  // Playback controls
  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  next: () => {
    const state = get();
    if (state.queue.length === 0) return;

    const nextIndex = (state.queueIndex + 1) % state.queue.length;
    const nextTrack = state.queue[nextIndex];

    set({
      currentTrack: nextTrack,
      queueIndex: nextIndex,
      currentTime: 0,
      isPlaying: true,
    });
  },

  previous: () => {
    const state = get();
    if (state.queue.length === 0) return;

    // If more than 5 seconds in, restart current track
    if (state.currentTime > 5) {
      set({ currentTime: 0 });
      return;
    }

    const prevIndex =
      state.queueIndex === 0 ? state.queue.length - 1 : state.queueIndex - 1;
    const prevTrack = state.queue[prevIndex];

    set({
      currentTrack: prevTrack,
      queueIndex: prevIndex,
      currentTime: 0,
      isPlaying: true,
    });
  },

  seek: (time) => {
    set({ currentTime: time });
  },

  // Volume (future enhancement)
  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(100, volume)) });
  },
}));
