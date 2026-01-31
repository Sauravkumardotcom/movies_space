import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import Header from '../Components/Header';
import VideoCard from '../Components/VideoCard';
import { videoApi } from '../services/api/videoApi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setVideos([]);
        setResultCount(0);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await videoApi.searchVideos(searchQuery);
        setVideos(results);
        setResultCount(results.length);
      } catch (err) {
        console.error('Search failed:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setVideos([]);
        setResultCount(0);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="text-blue-500" size={32} />
            <h1 className="text-4xl font-bold text-white">
              Search Results
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {searchQuery && `Showing results for "${searchQuery}"`}
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
            <p className="text-gray-400">Searching for "{searchQuery}"...</p>
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
        {!loading && !error && resultCount === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl mb-4">
              No results found for "{searchQuery}"
            </p>
            <p className="text-gray-500">
              Try searching with different keywords or browse our categories.
            </p>
          </motion.div>
        )}

        {/* Results Grid */}
        {!loading && !error && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <p className="text-gray-400 mb-6">
              Found {resultCount} result{resultCount !== 1 ? 's' : ''}
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

        {/* Empty Initial State */}
        {!loading && !error && resultCount === 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl">
              Enter a search term to find movies and series
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
