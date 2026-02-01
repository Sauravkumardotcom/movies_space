import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center max-w-md"
          >
            {/* Error Icon */}
            <motion.div 
              className="text-7xl mb-6 inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚠️
            </motion.div>

            {/* Error Title */}
            <motion.h1 
              className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Error Message */}
            <motion.p 
              className="text-gray-400 mb-8 text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {this.state.error?.message || 'An unexpected error occurred. Please try reloading the page.'}
            </motion.p>

            {/* Reload Button - Premium */}
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
            >
              🔄 Reload Page
            </motion.button>

            {/* Additional Help Text */}
            <motion.p 
              className="text-xs text-gray-500 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              If the problem persists, please try clearing your browser cache or contact support.
            </motion.p>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
