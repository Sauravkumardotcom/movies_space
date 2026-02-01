import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Trending', icon: '🔥', path: '/trending' },
    { label: 'New & Hot', icon: '✨', path: '/new' },
    { label: 'My List', icon: '❤️', path: '/favorites' },
    { label: 'Watch History', icon: '⏱️', path: '/history' },
    { label: 'Shorts', icon: '📱', path: '/shorts' },
  ];

  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Animation',
    'Documentary',
  ];

  const isActive = (path) => location.pathname === path;

  const menuVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${
        isCollapsed ? 'w-24' : 'w-72'
      } hidden md:flex flex-col bg-gradient-to-b from-gray-900 via-black to-black border-r border-white/10 transition-all duration-300`}
    >
      {/* Collapse Button */}
      <div className="p-4 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </motion.button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.path}
            custom={i}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Genres Section */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="px-4 py-6 border-t border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <h3 className="text-gray-300 text-xs font-bold mb-4 uppercase tracking-wider">
            Genres
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="block text-gray-400 hover:text-white text-xs py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                {genre}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer Info */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="px-4 py-4 border-t border-white/10 text-xs text-gray-500 space-y-1.5"
        >
          <p>© 2024 MovieSpace</p>
          <p className="text-gray-600">Premium streaming</p>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
