import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import VideoCard from '../components/VideoCard';
import { formatDate } from '../utils/helpers';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { watchHistory, addToWatchHistory } = useAppStore();

  const handleVideoClick = (video) => {
    addToWatchHistory(video);
    navigate(`/watch/${video.id}`);
  };

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
        className="px-6 md:px-12 py-8 border-b border-gray-800 bg-gradient-to-r from-purple-600/10 to-transparent"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">⏱️</span>
          <h1 className="text-4xl font-bold">Watch History</h1>
        </div>
        <p className="text-gray-400">
          {watchHistory.length === 0
            ? 'Videos you watch will appear here'
            : `${watchHistory.length} video${watchHistory.length !== 1 ? 's' : ''} watched`}
        </p>
      </motion.div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8">
        {watchHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold mb-2">No Watch History</h2>
            <p className="text-gray-400 mb-6">
              Start watching videos to build your watch history
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Explore Videos
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {watchHistory.map((video) => (
              <motion.div
                key={`${video.id}-${video.watchedAt}`}
                variants={itemVariants}
                onClick={() => handleVideoClick(video)}
                className="relative group"
              >
                {/* Watch time badge */}
                <div className="absolute top-2 right-2 z-10 bg-black/80 px-2 py-1 rounded text-xs text-gray-300">
                  Watched {formatDate(video.watchedAt)}
                </div>
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
