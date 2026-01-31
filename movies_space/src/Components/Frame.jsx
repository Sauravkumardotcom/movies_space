import { motion } from "framer-motion";

const VideoFrame = ({ src, title, poster }) => (
  <div className="relative w-full aspect-video rounded-xl overflow-hidden group bg-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <video
        className="w-full h-full object-cover"
        src={src}
        controls
        title={title}
        poster={poster}
      />

      <button
        onClick={() => {
          const videoId = src.match(/\/d\/(.*?)\/preview/)?.[1];
          const downloadUrl = videoId 
            ? `https://drive.google.com/uc?export=download&id=${videoId}`
            : src;
          window.open(downloadUrl, '_blank');
        }}
        className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/75 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
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
      </button>

      <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <h3 className="text-white text-lg font-bold truncate">{title}</h3>
      </div>
    </motion.div>
  </div>
);

export default VideoFrame;
