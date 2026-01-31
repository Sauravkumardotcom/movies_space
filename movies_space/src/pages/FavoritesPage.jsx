import React from 'react';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import { useAppStore } from '../store/useAppStore';

const FavoritesPage = () => {
  const { favorites } = useAppStore();

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
        className="px-6 md:px-12 py-8 border-b border-gray-800"
      >
        <h1 className="text-4xl font-bold mb-2">❤️ My Favorites</h1>
        <p className="text-gray-400">
          {favorites.length === 0
            ? 'Add movies to your favorites to see them here'
            : `You have ${favorites.length} favorite${favorites.length !== 1 ? 's' : ''}`}
        </p>
      </motion.div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">Your Favorites is Empty</h2>
            <p className="text-gray-400 mb-6">
              Start adding movies to your favorites by clicking the heart icon on any movie card
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {favorites.map((video) => (
              <motion.div key={video.id} variants={itemVariants}>
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
