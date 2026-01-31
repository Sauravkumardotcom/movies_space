import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Trending', icon: '🔥', path: '/trending' },
    { label: 'New & Hot', icon: '🆕', path: '/new' },
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

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex flex-col bg-black border-r border-gray-800 transition-all duration-300`}
    >
      {/* Collapse Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-900 rounded-lg transition"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="font-semibold">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Genres Section */}
      {!isCollapsed && (
        <div className="px-4 py-6 border-t border-gray-800">
          <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
            Browse
          </h3>
          <div className="space-y-2">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="block text-gray-400 hover:text-white text-sm py-2 px-2 rounded hover:bg-gray-900 transition"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500 space-y-2">
          <p>© 2024 MovieSpace</p>
          <p>Your premium streaming experience</p>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
