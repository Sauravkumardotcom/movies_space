import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNotificationContext } from '../context';
import { driveApi } from '../services/google';

const UploadModal = ({ isOpen, onClose }) => {
  const { user } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: [],
    language: 'English',
    year: new Date().getFullYear(),
    videoFile: null,
    posterFile: null,
    subtitleFile: null,
    gdriveVideoId: '', // Google Drive video file ID
    director: '',
    rating: 8.5,
    duration: 120,
  });

  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Note: In a full implementation, you would upload files to Google Drive using driveApi
      // For now, we'll use the form data directly
      setUploadProgress(20);

      // Create video data object
      const videoData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre.length > 0 ? formData.genre : ['Unknown'],
        language: formData.language,
        releaseYear: formData.year,
        duration: formData.duration,
        rating: formData.rating,
        director: formData.director || 'Unknown',
        uploadedBy: user?.name || 'Anonymous',
        uploadedAt: new Date(),
        id: `uploaded_${Date.now()}`,
        watched: 0,
        views: 0,
        cast: ['Various'],
        type: 'movie',
        poster: 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(formData.title),
        // Use Google Drive direct download URL
        videoUrl: formData.gdriveVideoId 
          ? `https://drive.google.com/file/d/${formData.gdriveVideoId}/preview`
          : 'https://www.w3schools.com/html/mov_bbb.mp4',
        src: formData.gdriveVideoId 
          ? `https://drive.google.com/uc?export=download&id=${formData.gdriveVideoId}&confirm=t`
          : 'https://www.w3schools.com/html/mov_bbb.mp4',
        gdriveVideoId: formData.gdriveVideoId || null,
        source: 'user-uploaded',
      };

      setUploadProgress(50);

      // In a real app, would call:
      // await driveApi.uploadToGoogleDrive(formData.videoFile);
      // For now, just add to store
      
      useAppStore.getState().addUploadedVideo(videoData);
      setUploadProgress(85);

      // Future: Call sheetsApi.addVideo(videoData) to persist to Sheets

      setUploadProgress(100);

      setTimeout(() => {
        onClose();
        resetForm();
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setUploadProgress(0);
    setUploadError(null);
    setFormData({
      title: '',
      description: '',
      genre: [],
      language: 'English',
      year: new Date().getFullYear(),
      videoFile: null,
      posterFile: null,
      subtitleFile: null,
      gdriveVideoId: '',
      director: '',
      rating: 8.5,
      duration: 120,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-transparent p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>📤</span> Upload Your Content
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-2xl text-gray-400 hover:text-white"
                disabled={isUploading}
              >
                ✕
              </motion.button>
            </div>

            {/* Error Message */}
            {uploadError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/20 border border-red-700 text-red-400 p-4 mx-6 mt-6 rounded-lg"
              >
                {uploadError}
              </motion.div>
            )}            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Video Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter video title"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your video..."
                      rows="4"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none resize-none"
                    />
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
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
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

                  {/* Language & Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Language</label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Director & Rating */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Director</label>
                      <input
                        type="text"
                        name="director"
                        value={formData.director}
                        onChange={handleInputChange}
                        placeholder="Director name"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Rating (1-10)</label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        step="0.1"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="120"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  {/* Google Drive Video ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">🔗 Google Drive Video ID (Optional)</label>
                    <input
                      type="text"
                      name="gdriveVideoId"
                      value={formData.gdriveVideoId}
                      onChange={handleInputChange}
                      placeholder="e.g., 1a2b3c4d5e6f7g8h9i0j"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-600 focus:outline-none font-mono text-sm"
                    />
                    <p className="text-gray-400 text-xs mt-1">📝 Share link: drive.google.com/file/d/[ID]/view</p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Files */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Video File */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Video File *</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-red-600 transition cursor-pointer">
                      <input
                        type="file"
                        name="videoFile"
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                        id="videoInput"
                        required
                      />
                      <label htmlFor="videoInput" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                        <p className="text-gray-400">
                          {formData.videoFile?.name || 'Click to upload or drag video'}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Poster File */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Poster Image</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-red-600 transition cursor-pointer">
                      <input
                        type="file"
                        name="posterFile"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="posterInput"
                      />
                      <label htmlFor="posterInput" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-400">
                          {formData.posterFile?.name || 'Click to upload poster'}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Subtitle File */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Subtitles (Optional)</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-red-600 transition cursor-pointer">
                      <input
                        type="file"
                        name="subtitleFile"
                        onChange={handleFileChange}
                        accept=".srt,.vtt"
                        className="hidden"
                        id="subtitleInput"
                      />
                      <label htmlFor="subtitleInput" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-400">
                          {formData.subtitleFile?.name || 'Click to upload subtitles (SRT or VTT)'}
                        </p>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Upload Progress */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 py-8"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-pink-600 mx-auto mb-4 flex items-center justify-center text-3xl">
                      📤
                    </div>
                    <h3 className="text-xl font-bold mb-2">Uploading Your Content</h3>
                    <p className="text-gray-400 mb-6">{uploadProgress}%</p>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-red-600 to-pink-600"
                    />
                  </div>

                  {uploadProgress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center text-green-400 font-semibold"
                    >
                      ✓ Upload Complete!
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-800">
                {step > 1 && step !== 3 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(step - 1)}
                    disabled={isUploading}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </motion.button>
                )}

                <div className="flex-1" />

                {step === 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.title || isUploading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </motion.button>
                )}

                {step === 2 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.videoFile || isUploading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    Next: Upload
                  </motion.button>
                )}

                {step === 3 && (
                  <>
                    {uploadProgress < 100 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isUploading}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
                      >
                        {isUploading ? 'Uploading...' : 'Start Upload'}
                      </motion.button>
                    )}
                    {uploadProgress === 100 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition cursor-pointer"
                      >
                        ✓ Done
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
