import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { authApi } from '../services/api/authApi';

/**
 * Admin Login Page
 * FIXES Issue #01: Removed hardcoded password
 * Now validates against backend (hashed password in .env)
 */
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAdminLoggedIn = useAppStore((state) => state.setAdminLoggedIn);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate via backend API (not hardcoded)
      await authApi.adminLogin(password);
      
      setAdminLoggedIn(true);
      navigate('/admin/panel');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(`❌ ${errorMessage}`);
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">🎬 MovieSpace</h1>
          <p className="text-gray-400">Admin Panel</p>
        </div>

        {/* Login Card */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-lg p-8 backdrop-blur-xl"
          whileHover={{ borderColor: '#ff1744' }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>

          <form onSubmit={handleLogin}>
            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔐 Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error on input change
                }}
                placeholder="Enter admin password"
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !password.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Verifying...
                </>
              ) : (
                <>
                  🔓 Enter Admin Panel
                </>
              )}
            </motion.button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition"
            >
              ← Back to MovieSpace
            </button>
          </div>
        </motion.div>

        {/* Security Info */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>🔒 Secure access - Admin panel only</p>
          <p className="mt-1 text-gray-600">Password validated via secure backend</p>
        </div>
      </motion.div>
    </div>
  );
}
