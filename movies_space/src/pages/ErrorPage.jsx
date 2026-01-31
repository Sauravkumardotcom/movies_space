import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Error Page Component - Displays error with custom message and action
 */
const ErrorPage = ({ 
  code = '500', 
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  action = 'Go Home'
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* Error Code */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4"
        >
          {code}
        </motion.div>

        {/* Error Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-gray-400 text-lg mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
          >
            {action}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
          >
            Go Back
          </motion.button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-12 text-6xl opacity-20"
        >
          😕
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * 404 Not Found Page
 */
export const NotFoundPage = () => (
  <ErrorPage
    code="404"
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved."
    action="Back to Home"
  />
);

/**
 * 500 Server Error Page
 */
export const ServerErrorPage = () => (
  <ErrorPage
    code="500"
    title="Server Error"
    message="Our servers are experiencing issues. Please try again later."
    action="Back to Home"
  />
);

/**
 * Network Error Page
 */
export const NetworkErrorPage = () => (
  <ErrorPage
    code="⚠️"
    title="Network Error"
    message="No internet connection. Please check your network and try again."
    action="Retry"
  />
);

export default ErrorPage;
