import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setUser({
        id: 1,
        email,
        name: email.split('@')[0],
      });
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-2xl">MS</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieSpace</h1>
          <p className="text-gray-400">Your Premium Streaming Platform</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          <div className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-600"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-600"
                required
              />
            </div>
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition mb-4"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <input type="checkbox" id="remember" className="w-4 h-4" />
            <label htmlFor="remember">Remember me</label>
          </div>
        </motion.form>

        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-sm text-blue-300"
        >
          <p className="font-semibold mb-2">Demo Mode</p>
          <p>Use any email and password to sign in. This is a demo application.</p>
        </motion.div>

        {/* Guest Access */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setUser({ id: 0, email: 'guest@moviespace.com', name: 'Guest' });
            navigate('/');
          }}
          className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition"
        >
          Continue as Guest
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginPage;
