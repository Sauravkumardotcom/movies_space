import React, { useState } from "react";
import { motion } from "framer-motion";

const NavBar = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-black/80 backdrop-blur-xl shadow-xl fixed top-0 left-0 z-50 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img 
              src="/logo.png" 
              alt="NamasteCode" 
              className="h-8 w-auto rounded-xl sm:h-10 object-contain"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                NamasteCode
              </span>
              <motion.span 
                className="text-xs text-gray-400 hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Your Movie Space
              </motion.span>
            </motion.div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#most-watched", label: "Most Watched" },
              { href: "#all-movies", label: "All Movies" }
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                className="text-gray-300 hover:text-white font-medium relative group"
                whileHover={{ color: "#fff" }}
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}

            {/* Search and Button Container */}
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <motion.div 
                className="relative hidden md:block"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <motion.input
                  type="text"
                  placeholder="Search movies..."
                  className="w-48 lg:w-64 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-sm"
                  animate={{
                    borderColor: isHovering ? "rgba(34, 211, 238, 0.5)" : "rgba(255, 255, 255, 0.1)"
                  }}
                />
                <motion.svg 
                  className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ scale: isHovering ? 1.2 : 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </motion.svg>
              </motion.div>

              {/* Request Movie Button */}
              <motion.button 
                onClick={() => window.dispatchEvent(new CustomEvent('openRequestModal'))}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg shadow-cyan-500/20"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Request Movie
              </motion.button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2 text-gray-400 hover:text-white transition"
            whileHover={{ scale: 1.1, color: "#fff" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
