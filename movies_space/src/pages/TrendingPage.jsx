import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrendingVideos } from '../hooks/useVideos';
import VideoCard from '../components/VideoCard';
import { useAppStore } from '../store/useAppStore';

const TrendingPage = () => {
  const navigate = useNavigate();
  const { data: trendingVideos, isLoading } = useTrendingVideos();
  const { addToWatchHistory } = useAppStore();

  const handleVideoClick = (video) => {
    addToWatchHistory(video);
    navigate(`/watch/${video.id}`);
  };

  const SkeletonCard = () => (
    <div className="bg-gray-800 rounded-lg h-64 animate-pulse" />
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 md:px-12 py-8 border-b border-gray-800 bg-gradient-to-r from-red-600/10 to-transparent"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🔥</span>
          <h1 className="text-4xl font-bold">Trending Now</h1>
        </div>
        <p className="text-gray-400">
          The hottest movies and shows everyone is watching right now
        </p>
      </motion.div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8">
        {isLoading ? (
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
            {trendingVideos?.map((video, index) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                onClick={() => handleVideoClick(video)}
                className="relative"
              >
                {/* Rank Badge */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-10 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black">
                    #{index + 1}
                  </div>
                )}
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
