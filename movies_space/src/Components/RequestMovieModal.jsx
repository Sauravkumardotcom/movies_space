import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { emailApi, validateEmail } from '../services/api/emailApi';

const RequestMovieModal = ({ isOpen, onClose }) => {
  const { addMovieRequest, user } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: new Date().getFullYear(),
    genre: [],
    description: '',
    reason: '',
    imdbLink: '',
    type: 'movie', // movie or series
    email: 'souravshakya951@gmail.com', // Pre-filled
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Animation',
    'Documentary',
    'Romance',
    'Crime',
    'Adventure',
    'Mystery',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate email
      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Create request object
      const requestData = {
        title: formData.title,
        releaseYear: formData.releaseYear,
        genre: formData.genre.length > 0 ? formData.genre : ['Unknown'],
        description: formData.description,
        reason: formData.reason,
        imdbLink: formData.imdbLink,
        type: formData.type,
        email: formData.email,
        requestedBy: user?.name || 'Anonymous',
        id: Date.now(),
        requestedAt: new Date(),
      };

      // Send confirmation email to user
      await emailApi.sendRequestConfirmation({
        email: formData.email,
        name: formData.title,
        title: formData.title,
        type: formData.type,
        description: formData.description,
      });

      // Add to store
      addMovieRequest(requestData);

      // Send admin notification
      await emailApi.sendAdminNotification({
        email: formData.email,
        name: user?.name || 'Anonymous',
        title: formData.title,
        type: formData.type,
        description: formData.description,
      });

      setSubmitMessage('✓ Request submitted! Check your email for confirmation.');

      setTimeout(() => {
        setFormData({
          title: '',
          releaseYear: new Date().getFullYear(),
          genre: [],
          description: '',
          reason: '',
          imdbLink: '',
          type: 'movie',
          email: 'souravshakya951@gmail.com',
        });
        setSubmitMessage(null);
        onClose();
      }, 2500);
    } catch (error) {
      setSubmitMessage('✕ Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl z-40"
          />

          {/* Modal - Premium Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-2xl shadow-2xl z-50 border border-white/10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-b from-gray-900 via-gray-900 to-transparent p-6 border-b border-white/10 backdrop-blur-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                  <span className="text-3xl">🎬</span> Request a Movie or Series
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  Tell us about content you'd like to see on MovieSpace
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-red-600/20 p-2 rounded-lg transition border border-white/10"
                disabled={isSubmitting}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Success Message - Premium */}
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 mx-6 mt-6 rounded-lg border backdrop-blur-sm ${
                  submitMessage.includes('✓')
                    ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/20'
                    : 'bg-red-900/30 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20'
                }`}
              >
                {submitMessage}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type Selection - Premium Buttons */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Type *</label>
                <div className="flex gap-4">
                  {['movie', 'series'].map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type }))}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition capitalize border ${
                        formData.type === type
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/30'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Title - Premium Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter movie or series title"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none placeholder-gray-500 backdrop-blur-sm transition-all"
                />
              </div>

              {/* Email - Premium Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none placeholder-gray-500 backdrop-blur-sm transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">📧 We'll notify you when this content is added</p>
              </div>

              {/* Release Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Release Year</label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                {/* IMDb Link */}
                <div>
                  <label className="block text-sm font-semibold mb-2">IMDb Link (Optional)</label>
                  <input
                    type="url"
                    name="imdbLink"
                    value={formData.imdbLink}
                    onChange={handleInputChange}
                    placeholder="https://imdb.com/title/..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-semibold mb-3">Genre</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {genres.map((genre) => (
                    <motion.button
                      key={genre}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                        formData.genre.includes(genre)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {genre}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description or plot summary..."
                  rows="3"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none placeholder-gray-600 resize-none"
                />
              </div>

              {/* Why you want it */}
              <div>
                <label className="block text-sm font-semibold mb-2">Why should we add it?</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Tell us why this content would be great to have..."
                  rows="3"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none placeholder-gray-600 resize-none"
                />
              </div>

              {/* Buttons - Premium Design */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-semibold transition disabled:opacity-50 backdrop-blur-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!formData.title || isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold transition disabled:opacity-50 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                >
                  {isSubmitting ? '⏳ Submitting...' : '✓ Submit Request'}
                </motion.button>
              </div>

              {/* Info - Premium Design */}
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-300 backdrop-blur-sm shadow-lg shadow-blue-500/10">
                <p className="font-semibold mb-2">📝 Note:</p>
                <p>
                  Our team will review your request and try to add the content soon. Popular
                  requests are prioritized! ⭐
                </p>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestMovieModal;
