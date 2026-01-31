import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShortVideos } from '../hooks/useVideos';
import { formatNumber } from '../utils/helpers';

const ShortsPage = () => {
  const { data: shorts, isLoading } = useShortVideos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState({});
  const touchStartY = useRef(0);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const lastKeyTimeRef = useRef(0);

  const handleSwipe = (newIndex) => {
    if (!shorts || newIndex < 0 || newIndex >= shorts.length) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSwipe(currentIndex + 1);
      } else {
        handleSwipe(currentIndex - 1);
      }
    }
  };

  const handleKeyDown = (e) => {
    const now = Date.now();
    if (now - lastKeyTimeRef.current < 300) return;
    
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      handleSwipe(currentIndex - 1);
      lastKeyTimeRef.current = now;
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      handleSwipe(currentIndex + 1);
      lastKeyTimeRef.current = now;
    }
    if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full"
        />
      </div>
    );
  }

  if (!shorts || shorts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-4xl mb-4">📹</p>
          <p className="text-xl text-gray-400">No shorts available yet</p>
        </div>
      </div>
    );
  }

  const currentShort = shorts[currentIndex];
  const shortLikes = likes[currentIndex] || currentShort.likes || 0;

  const toggleLike = () => {
    setLikes((prev) => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || currentShort.likes) + (likes[currentIndex] && likes[currentIndex] > currentShort.likes ? -1 : 1),
    }));
  };

  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-full bg-black overflow-hidden flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Video Container */}
          <div className="relative w-full h-full md:max-w-lg mx-auto bg-gray-950 overflow-hidden md:rounded-3xl md:shadow-2xl">
            {/* Video */}
            <video
              ref={videoRef}
              src={currentShort.videoUrl || currentShort.src}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

            {/* Play/Pause Button (Center) */}
            {!isPlaying && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 hover:bg-black/50 transition"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </motion.button>
            )}

            {/* Right Side - Interactions */}
            <div className="absolute right-4 bottom-24 md:bottom-32 flex flex-col gap-6 z-20">
              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className="flex flex-col items-center gap-2 group"
              >
                <motion.div
                  animate={likes[currentIndex] && likes[currentIndex] > currentShort.likes ? { scale: [1, 1.3, 1] } : {}}
                  className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition group-hover:bg-red-600/50"
                >
                  <svg 
                    className="w-7 h-7" 
                    fill={likes[currentIndex] && likes[currentIndex] > currentShort.likes ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </motion.div>
                <span className="text-white text-xs font-semibold">{formatNumber(shortLikes)}</span>
              </motion.button>

              {/* Comment Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition group-hover:bg-blue-600/50">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold">{formatNumber(currentShort.comments || 0)}</span>
              </motion.button>

              {/* Share Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition group-hover:bg-green-600/50">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C9.839 13.81 11.417 14 13 14c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4c0 1.393.409 2.701 1.08 3.721m0 0l2.6 1.5m0 0l2.4-3.5"
                    />
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold">{formatNumber(currentShort.shares || 0)}</span>
              </motion.button>

              {/* Creator Follow */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white hover:border-pink-300 transition shadow-lg"
              >
                +
              </motion.button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-end gap-3">
                {/* Creator Avatar */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 border-2 border-white"
                >
                  {(currentShort.creator || 'U').charAt(0).toUpperCase()}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-white font-bold text-base md:text-lg line-clamp-2">
                    {currentShort.title}
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm">@{currentShort.creator || 'unknown'}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-xs md:text-sm text-gray-300 mt-3 ml-15">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M12.935 11.75a4 4 0 00-3.87-2.25A4 4 0 005.064 16H19a4 4 0 00-7.065-4.25z" />
                  </svg>
                  {formatNumber(currentShort.views || 0)}
                </span>
              </div>
            </div>

            {/* Top Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
              {shorts.map((_, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => handleSwipe(idx)}
                  className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${
                    idx === currentIndex
                      ? 'bg-white/80'
                      : idx < currentIndex
                      ? 'bg-white/40'
                      : 'bg-white/20'
                  }`}
                  whileHover={{ height: 6 }}
                />
              ))}
            </div>

            {/* Navigation Indicators */}
            <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none md:pointer-events-auto">
              {/* Previous */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="hidden md:flex w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
                </svg>
              </motion.button>

              {/* Next */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe(currentIndex + 1)}
                disabled={currentIndex === shorts.length - 1}
                className="hidden md:flex w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7m0 0l7-7m-7 7V3" />
                </svg>
              </motion.button>
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold">
              {currentIndex + 1} / {shorts.length}
            </div>

            {/* Keyboard Hint (Mobile) */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white text-xs text-center opacity-50 md:hidden">
              ↑ ↓ Swipe • Space Play/Pause
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ShortsPage;
