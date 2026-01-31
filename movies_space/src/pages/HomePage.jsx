import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVideos, useTrendingVideos } from '../hooks/useVideos';
import VideoCard from '../components/VideoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { PageTransition, StaggerContainer, StaggerItem } from '../components/animations/PageAnimations';
import { useAppStore } from '../store/useAppStore';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: allVideos, isLoading: videosLoading } = useVideos();
  const { data: trendingVideos, isLoading: trendingLoading } = useTrendingVideos();
  const { addToWatchHistory } = useAppStore();

  const handleVideoClick = (video) => {
    addToWatchHistory(video);
    navigate(`/watch/${video.id}`);
  };

  const SkeletonCard = () => (
    <div className="bg-gray-800 rounded-lg h-64 animate-pulse" />
  );

  // Trending Section with skeleton loader
  if (trendingLoading) {
    return (
      <div className="min-h-screen pb-10">
        <div className="px-6 md:px-12 mb-12">
          <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
          <SkeletonLoader variant="grid" count={5} />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 md:h-[500px] bg-gradient-to-b from-gray-900 to-black overflow-hidden mb-8"
      >
        {allVideos && allVideos.length > 0 && (
          <>
            <img
              src={allVideos[0].poster}
              alt={allVideos[0].title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                {allVideos[0].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-lg md:text-xl max-w-2xl mb-6"
              >
                {allVideos[0].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVideoClick(allVideos[0])}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  More Info
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>

      {/* Trending Section */}
      <div className="px-6 md:px-12 mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🔥</span> Trending Now
        </h2>

        {trendingLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {trendingVideos?.map((video) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                onClick={() => handleVideoClick(video)}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* All Videos Section */}
      <div className="px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>

        {videosLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {allVideos?.map((video) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                onClick={() => handleVideoClick(video)}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
