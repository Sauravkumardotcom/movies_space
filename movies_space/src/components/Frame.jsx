import { motion } from "framer-motion";

const VideoFrame = ({ src, title, poster }) => (
  <div className="relative w-full aspect-video rounded-xl overflow-hidden group bg-gradient-to-br from-gray-900 to-black border border-white/5 shadow-xl">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <motion.video
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full object-cover"
        src={src}
        controls
        title={title}
        poster={poster}
      />

      {/* Download Button - Premium */}
      <motion.button
        onClick={() => {
          const videoId = src.match(/\/d\/(.*?)\/preview/)?.[1];
          const downloadUrl = videoId 
            ? `https://drive.google.com/uc?export=download&id=${videoId}`
            : src;
          window.open(downloadUrl, '_blank');
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg shadow-cyan-500/50 border border-white/20"
        title="Download Video"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      </motion.button>

      {/* Title Header - Enhanced */}
      <motion.div 
        className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white text-lg font-bold truncate group-hover:text-cyan-400 transition-colors">{title}</h3>
      </motion.div>
    </motion.div>
  </div>
);

export default VideoFrame;
