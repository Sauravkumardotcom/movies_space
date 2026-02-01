import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { debounce } from '../utils/helpers';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, isAuthenticated, user, setUploadModalOpen, setRequestModalOpen } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg"
    >
      <div className="px-4 md:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Clean and Minimal */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">🎬</span>
            </div>
            <span className="hidden sm:block text-lg font-bold text-white">MovieSpace</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-6 lg:mx-8 max-w-lg">
            <motion.div 
              className="w-full relative"
              animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`relative flex items-center transition-all duration-200 ${
                isSearchFocused 
                  ? 'ring-2 ring-blue-500/50' 
                  : 'ring-1 ring-white/10 hover:ring-white/20'
              } rounded-full bg-white/5 backdrop-blur-sm`}>
                <svg
                  className="w-5 h-5 ml-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search movies, shows..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-gray-500 text-sm"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Request Movie Button - Desktop */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.9)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRequestModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-blue-500/20"
              title="Request a movie or series"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                />
              </svg>
            </motion.button>

            {/* Upload Button - Desktop */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.9)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUploadModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-red-500/20"
              title="Upload movie"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9H13V7h-2v4H8.5l3.5 3.5 3.5-3.5z" />
              </svg>
            </motion.button>

            {/* Admin Panel Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(147, 51, 234, 0.9)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/login')}
              className="hidden sm:flex items-center gap-2 bg-purple-600/80 hover:bg-purple-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-purple-500/20"
              title="Admin panel"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </motion.button>

            {/* Mobile Search Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const searchInput = document.querySelector('[type="text"][placeholder*="Search"]');
                searchInput?.focus();
              }}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.button>

            {/* User Avatar / Sign In */}
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full cursor-pointer shadow-lg hover:shadow-blue-500/30 transition-shadow"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-blue-500/20"
                >
                  Sign In
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
                  strokeWidth={1.5}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar - Below Header */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isMobileMenuOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden mt-3 pt-3 border-t border-white/5"
        >
          <div className="relative flex items-center rounded-full bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
            <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent text-white px-3 py-2 focus:outline-none placeholder-gray-500 text-sm"
            />
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setRequestModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600/80 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition text-sm"
            >
              Request
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setUploadModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-red-600/80 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition text-sm"
            >
              Upload
            </motion.button>
          </div>
        </motion.div>

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
