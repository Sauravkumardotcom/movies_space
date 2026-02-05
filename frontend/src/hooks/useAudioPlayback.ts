import { useEffect, useRef } from 'react';
import { Howler, Howl } from 'howler';
import { useAudioPlayer } from '../store/audio';
import type { Music } from '../services/music';

/**
 * Custom hook to manage Howler.js audio playback with Zustand state
 */
export const useAudioPlayback = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    volume,
  } = useAudioPlayer();

  const soundRef = useRef<Howl | null>(null);
  const animationFrameRef = useRef<number>();

  // ============================================
  // SETUP & CLEANUP
  // ============================================

  useEffect(() => {
    // Clean up previous sound
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }

    if (!currentTrack?.streamUrl) return;

    // Create new Howl instance
    soundRef.current = new Howl({
      src: [currentTrack.streamUrl],
      html5: true,
      volume: volume / 100,
      onload: () => {
        if (soundRef.current) {
          setDuration(soundRef.current.duration());
        }
      },
      onplay: () => {
        setIsPlaying(true);
        updateProgress();
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
        // TODO: Auto-play next track from queue
      },
      onerror: (err) => {
        console.error('Howler error:', err);
        setIsPlaying(false);
      },
    });

    // Auto-play if should be playing
    if (isPlaying) {
      soundRef.current.play();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentTrack?.streamUrl]);

  // ============================================
  // PLAYBACK CONTROL
  // ============================================

  useEffect(() => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.play();
      updateProgress();
    } else {
      soundRef.current.pause();
    }
  }, [isPlaying]);

  // ============================================
  // VOLUME CONTROL
  // ============================================

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume / 100);
    }
  }, [volume]);

  // ============================================
  // TIME SEEKING
  // ============================================

  useEffect(() => {
    if (!soundRef.current) return;

    // Only seek if difference is significant (avoid sync loops)
    const soundTime = soundRef.current.seek();
    if (Math.abs(soundTime - currentTime) > 0.5) {
      soundRef.current.seek(currentTime);
    }
  }, [currentTime]);

  // ============================================
  // PROGRESS TRACKING
  // ============================================

  const updateProgress = () => {
    if (!soundRef.current || !soundRef.current.playing()) {
      return;
    }

    const currentTime = soundRef.current.seek();
    setCurrentTime(currentTime);

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  // ============================================
  // EXPOSE CONTROL METHODS
  // ============================================

  return {
    sound: soundRef.current,
    isReady: !!soundRef.current && currentTrack !== null,
  };
};

export default useAudioPlayback;
