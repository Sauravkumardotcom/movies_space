import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PlayerState, Music } from '@types/music';

interface PlayerStore extends PlayerState {
  play: (song: Music, queue?: Music[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeat: (mode: 'off' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  setQueue: (queue: Music[]) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  devtools((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    repeat: 'off',
    isShuffle: false,

    play: (song, queue = [song]) =>
      set({ currentSong: song, queue, isPlaying: true, currentIndex: 0 }),

    pause: () => set({ isPlaying: false }),

    resume: () => set({ isPlaying: true }),

    next: () => {
      const { queue, currentIndex, isShuffle } = get();
      let nextIndex = currentIndex + 1;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      if (nextIndex < queue.length) {
        set({
          currentSong: queue[nextIndex],
          currentIndex: nextIndex,
          currentTime: 0,
        });
      }
    },

    previous: () => {
      const { queue, currentIndex } = get();
      const prevIndex = Math.max(0, currentIndex - 1);
      if (queue[prevIndex]) {
        set({
          currentSong: queue[prevIndex],
          currentIndex: prevIndex,
          currentTime: 0,
        });
      }
    },

    seek: (time) => set({ currentTime: time }),

    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    setRepeat: (mode) => set({ repeat: mode }),

    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

    setQueue: (queue) => set({ queue }),
  }))
);
