import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Loader2 } from 'lucide-react';
import Header from '../Components/Header';
import VideoCard from '../Components/VideoCard';
import { videoApi } from '../services/api/videoApi';

const GenrePage = () => {
  const { genre } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedGenre, setFormattedGenre] = useState('');

  useEffect(() => {
    const fetchVideosByGenre = async () => {
      if (!genre) {
        setError('No genre specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Format genre for display
        const formatted = genre
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setFormattedGenre(formatted);

        // Fetch videos for this genre
        const results = await videoApi.getVideosByGenre(genre);
        setVideos(results);
      } catch (err) {
        console.error('Failed to fetch genre videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideosByGenre();
  }, [genre]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Genre Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Film className="text-blue-500" size={32} />
            <h1 className="text-4xl font-bold text-white">
              {formattedGenre || 'Genre'}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Browse all {formattedGenre ? formattedGenre.toLowerCase() : ''} content
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-gray-400">Loading {formattedGenre}...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-center"
          >
            <p className="text-red-400">❌ {error}</p>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl mb-4">
              No {formattedGenre} content available yet
            </p>
            <p className="text-gray-500">
              Check back later for more content in this genre.
            </p>
          </motion.div>
        )}

        {/* Videos Grid */}
        {!loading && !error && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <p className="text-gray-400 mb-6">
              {videos.length} {formattedGenre} {videos.length === 1 ? 'item' : 'items'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default GenrePage;
