import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestMovie = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    movieName: '',
    description: '',
    email: ''
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openRequestModal', handleOpen);
    return () => window.removeEventListener('openRequestModal', handleOpen);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setIsOpen(false);
    setFormData({ movieName: '', description: '', email: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl z-50"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Request a Movie</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Movie Name</label>
                <input
                  type="text"
                  value={formData.movieName}
                  onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Your Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestMovie;