import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { debounce } from '../utils/helpers';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, isAuthenticated, user, setUploadModalOpen, setRequestModalOpen } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = debounce((query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-gradient-to-b from-black via-black to-transparent backdrop-blur-sm border-b border-gray-800"
    >
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">MS</span>
            </div>
            <span className="hidden sm:block">MovieSpace</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search movies, shows, and more..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
              />
              <svg
                className="w-5 h-5 absolute right-3 top-2.5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Request Movie Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRequestModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-semibold transition text-sm"
              title="Request a movie or series"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Request
            </motion.button>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUploadModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload
            </motion.button>

            {/* Admin Panel Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/login')}
              className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full font-semibold transition text-sm"
              title="Admin panel"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Admin
            </motion.button>

            {/* User Avatar */}
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full cursor-pointer"
              />
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-900 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
