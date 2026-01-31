import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNotificationContext } from '../context';

export default function AdminPanel() {
  const navigate = useNavigate();
  const isAdminLoggedIn = useAppStore((state) => state.isAdminLoggedIn);
  const customMovies = useAppStore((state) => state.customMovies);
  const addCustomMovie = useAppStore((state) => state.addCustomMovie);
  const removeCustomMovie = useAppStore((state) => state.removeCustomMovie);
  const adminLogout = useAppStore((state) => state.adminLogout);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    rating: 8.5,
    posterUrl: '',
    duration: 120,
    director: '',
    isShort: false,
    videoSource: 'url',
    videoUrl: '',
    gdriveFileId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'rating' || name === 'duration' ? parseFloat(value) : value,
    }));
    setError('');
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title) {
      setError('❌ Movie title is required');
      return;
    }

    if (formData.videoSource === 'url') {
      if (!formData.videoUrl || !formData.videoUrl.trim()) {
        setError('❌ Please enter a valid video URL');
        return;
      }
      try {
        new URL(formData.videoUrl);
      } catch {
        setError('❌ Invalid URL format');
        return;
      }
    } else if (formData.videoSource === 'gdrive') {
      if (!formData.gdriveFileId || !formData.gdriveFileId.trim()) {
        setError('❌ Please enter a Google Drive file ID');
        return;
      }
      if (!formData.gdriveFileId.match(/^[a-zA-Z0-9_-]+$/)) {
        setError('❌ Invalid Google Drive file ID format');
        return;
      }
    }

    let finalVideoUrl = '';
    if (formData.videoSource === 'url') {
      finalVideoUrl = formData.videoUrl;
    } else if (formData.videoSource === 'gdrive') {
      // For embedded video streaming from Google Drive using iframe
      // Use /preview endpoint for proper embedding
      finalVideoUrl = `https://drive.google.com/file/d/${formData.gdriveFileId}/preview`;
    }

    const newMovie = {
      title: formData.title,
      description: formData.description || 'Custom movie added via admin panel',
      genre: formData.genre ? formData.genre.split(',').map(g => g.trim()) : ['Action'],
      releaseYear: formData.releaseYear,
      year: formData.releaseYear,
      rating: formData.rating,
      duration: formData.duration,
      director: formData.director || 'Unknown',
      videoUrl: finalVideoUrl,
      src: finalVideoUrl,
      videoSource: formData.videoSource,
      gdriveFileId: formData.videoSource === 'gdrive' ? formData.gdriveFileId : null,
      poster: formData.posterUrl || `https://placehold.co/300x450?text=${encodeURIComponent(formData.title)}&font=raleway`,
      posterUrl: formData.posterUrl || `https://placehold.co/300x450?text=${encodeURIComponent(formData.title)}&font=raleway`,
      source: 'admin-added',
      isCustom: true,
      isShort: formData.isShort || false,
      watched: 0,
      cast: ['Various'],
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      creator: 'Admin',
      language: 'Unknown',
      added: new Date().getTime(),
    };

    addCustomMovie(newMovie);
    setSuccess(`✅ "${formData.title}" added successfully!${formData.isShort ? ' (Added to Shorts)' : ''}`);

    // Note: Consider calling sheetsApi.addVideo(newMovie) here to persist to Google Sheets
    // For now, movie is stored in Zustand store and localStorage

    setFormData({
      title: '',
      description: '',
      genre: '',
      releaseYear: new Date().getFullYear(),
      rating: 8.5,
      posterUrl: '',
      duration: 120,
      director: '',
      isShort: false,
      videoSource: 'url',
      videoUrl: '',
      gdriveFileId: '',
    });

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-600">🎬 MovieSpace Admin</h1>
            <p className="text-gray-400 text-sm">Manage movies and content</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            🚪 Logout
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">➕ Add New Movie</h2>

              <form onSubmit={handleAddMovie} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">🎬 Movie Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Tere Ishk Mein, Avatar 3"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">📹 Video Source *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-3 bg-gray-800 border-2 rounded-lg cursor-pointer transition flex-1" style={{ borderColor: formData.videoSource === 'url' ? '#06b6d4' : '#1f2937' }}>
                      <input
                        type="radio"
                        value="url"
                        checked={formData.videoSource === 'url'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, videoSource: e.target.value }))}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-300">🌐 Direct URL</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-800 border-2 rounded-lg cursor-pointer transition flex-1" style={{ borderColor: formData.videoSource === 'gdrive' ? '#06b6d4' : '#1f2937' }}>
                      <input
                        type="radio"
                        value="gdrive"
                        checked={formData.videoSource === 'gdrive'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, videoSource: e.target.value }))}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-300">☁️ Google Drive</span>
                    </label>
                  </div>
                </div>

                {formData.videoSource === 'url' && (
                  <div className="border border-cyan-500/30 bg-cyan-500/5 rounded-lg p-4">
                    <label className="block text-sm font-medium text-cyan-300 mb-2">🌐 Video URL *</label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/movie.mp4"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                    />
                    <div className="mt-3 space-y-2 text-xs text-gray-300">
                      <p className="font-semibold text-cyan-300">📌 Paste complete video URL</p>
                      <p className="text-gray-400">Supports: .mp4, .mov, .mkv, .webm, HLS/DASH</p>
                      <p className="text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">⚠️ CORS Note: URL must be CORS-enabled or serve from allowed origin</p>
                      <p className="text-gray-400">Test URLs (public, CORS-enabled):</p>
                      <div className="bg-gray-800 p-2 rounded space-y-1 font-mono text-xs">
                        <p className="text-cyan-400">✅ https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4</p>
                        <p className="text-cyan-400">✅ https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.videoSource === 'gdrive' && (
                  <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-4">
                    <label className="block text-sm font-medium text-blue-300 mb-2">☁️ Google Drive File ID *</label>
                    <input
                      type="text"
                      name="gdriveFileId"
                      value={formData.gdriveFileId}
                      onChange={handleInputChange}
                      placeholder="e.g., 1a2b3c4d5e6f7g8h9i0j"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-0 transition font-mono text-sm"
                    />
                    <div className="mt-3 space-y-2 text-xs">
                      <p className="font-semibold text-blue-300">📌 How to find Google Drive File ID:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-300 ml-2">
                        <li>Open your file on Google Drive</li>
                        <li>Click Share button</li>
                        <li>Change to "Anyone with the link"</li>
                        <li>Copy the share link</li>
                        <li>Extract ID from: <span className="font-mono text-cyan-400">drive.google.com/file/d/[ID]/view</span></li>
                        <li>Paste only the <span className="font-mono bg-gray-800 px-1">[ID]</span> part</li>
                      </ol>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">👤 Director</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    placeholder="e.g., James Cameron"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">📝 Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Movie plot and details..."
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">🎭 Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="e.g., Sci-Fi, Action, Romance"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">📅 Release Year</label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">⏱️ Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">⭐ Rating (1-10)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">🖼️ Poster URL (Optional)</label>
                  <input
                    type="url"
                    name="posterUrl"
                    placeholder="https://..."
                    value={formData.posterUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                  <p className="text-gray-400 text-xs mt-1">💡 Leave empty for auto-generated placeholder</p>
                </div>

                <div>
                  <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-cyan-500/50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={formData.isShort}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isShort: e.target.checked }))}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-300">📹 Mark as Short Video</span>
                  </label>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm"
                  >
                    {success}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  ➕ Add Movie
                </motion.button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-24 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">🎬 Custom Movies ({customMovies.length})</h3>

              <div className="space-y-4">
                {customMovies.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">📽️ No custom movies yet</p>
                ) : (
                  customMovies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition"
                    >
                      <h4 className="font-semibold text-white mb-2 line-clamp-2">{movie.title}</h4>
                      <div className="space-y-1 text-xs text-gray-400 mb-3">
                        <p>📅 {movie.releaseYear}</p>
                        <p>⭐ {movie.rating}/10</p>
                        <p>⏱️ {movie.duration} min</p>
                        {movie.videoSource && (
                          <p className="text-cyan-400 font-semibold">
                            {movie.videoSource === 'url' ? '🌐 URL' : '☁️ Drive'}
                          </p>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeCustomMovie(movie.id)}
                        className="w-full px-3 py-1 bg-red-900/30 hover:bg-red-900/60 border border-red-700 rounded text-red-400 text-xs font-semibold transition"
                      >
                        🗑️ Remove
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
