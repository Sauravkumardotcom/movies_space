import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDuration, getVideoErrorMessage } from '../utils/helpers';

const VideoPlayer = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Detect if this is a Google Drive video (direct download URL)
  const isGoogleDriveVideo = video.src?.includes('drive.google.com') && video.src?.includes('export=download');

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const controlsTimeoutRef = useRef(null);

  // Update current time
  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // Update duration
  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  // Play/Pause
  const togglePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Prevent abort error by checking video is ready
        if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA or better
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.warn('Play error:', error);
                // Don't update state on error to prevent state mismatch
              });
          }
        }
      }
    }
  };

  // Seek
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Playback rate
  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'KeyF') {
        toggleFullscreen();
      }
      if (e.code === 'KeyM') {
        setVolume(volume === 0 ? 1 : 0);
      }
      if (e.code === 'ArrowRight') {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration);
        }
      }
      if (e.code === 'ArrowLeft') {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, duration, volume, videoError]);

  // Sync play/pause state with video element
  useEffect(() => {
    if (!videoRef.current || videoError) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const video = videoRef.current;
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoError]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Debug: log video object to check src
  React.useEffect(() => {
    console.log('VideoPlayer received video:', video);
    console.log('Video src:', video?.src);
    console.log('Video videoUrl:', video?.videoUrl);
  }, [video]);

  // Check if video data is available
  if (!video) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      >
        <div className="text-white text-center">
          <p className="text-xl mb-4">❌ Video not found</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`${isTheaterMode ? 'w-screen' : 'w-full'} h-screen bg-black relative group`}
      >
        {/* Video Error Display */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-8 max-w-2xl text-white">
              <p className="text-2xl mb-2">❌ Video Cannot Play</p>
              <p className="text-red-300 mb-4 font-semibold">{videoError.message}</p>
              
              {/* Format Error Specific Advice */}
              {videoError.code === 4 && (
                <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3 mb-4 text-sm">
                  <p className="font-semibold text-yellow-300 mb-2">🎬 Format/Codec Error Detected</p>
                  <p className="text-gray-300 mb-2">The video file uses an unsupported codec. Common causes:</p>
                  <ul className="text-gray-400 space-y-1 ml-4 mb-2">
                    <li>• File is .mov, .mkv, or uses ProRes/Apple codec</li>
                    <li>• Video needs to be re-encoded to H.264 MP4</li>
                    <li>• Browser doesn't support the codec</li>
                  </ul>
                  <p className="text-yellow-200 font-mono text-xs break-all">{videoError.src}</p>
                </div>
              )}

              {/* CORS Error Specific Advice */}
              {videoError.message?.includes('CORS') && (
                <div className="bg-blue-900/30 border border-blue-600 rounded p-3 mb-4 text-sm">
                  <p className="font-semibold text-blue-300 mb-2">🔒 CORS (Cross-Origin) Blocked</p>
                  <p className="text-gray-300">Use a CORS-enabled video URL or upload to your own server</p>
                </div>
              )}

              <div className="space-y-2 text-xs text-gray-300 mb-4">
                <p className="font-semibold">💡 Solutions:</p>
                <ul className="text-left space-y-1 ml-4">
                  <li>✅ Use H.264 MP4 format (most compatible)</li>
                  <li>✅ Try one of these test URLs:</li>
                  <li className="font-mono text-cyan-400 ml-4">https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4</li>
                  <li>✅ For your video: re-encode to H.264 MP4 using:</li>
                  <li className="font-mono text-cyan-400 ml-4">ffmpeg -i input.mov -vcodec libx264 output.mp4</li>
                  <li>✅ Or convert online at CloudConvert.com or FFmpeg.online</li>
                </ul>
              </div>

              <p className="text-xs text-gray-400 mb-4 break-all font-mono bg-black/50 p-2 rounded">
                URL: {videoError.src}
              </p>

              <button
                onClick={onClose}
                className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Video Element for all sources */}
        <video
            ref={videoRef}
            src={video.src || video.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Video error:', e.target.error);
              console.error('Video src:', video.src || video.videoUrl);
              console.error('Full video object:', video);
              const errorMsg = getVideoErrorMessage(e.target.error?.code);
              setVideoError({
                message: errorMsg,
                code: e.target.error?.code,
                src: video.src || video.videoUrl,
              });
              setIsPlaying(false);
            }}
            onCanPlay={() => {
              setVideoError(null);
            }}
          />

        {/* Controls Overlay */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"
        >
          {showControls && (
            <div className="absolute inset-0 pointer-events-auto">
              {/* Title and Info */}
              <div className="absolute top-6 left-6 right-6 text-white">
                <h2 className="text-3xl font-bold">{video.title}</h2>
                <p className="text-gray-300 mt-2">{video.description}</p>
              </div>

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                {/* Progress Bar */}
                <div className="w-full space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlay}
                      className="text-white hover:text-red-600 transition duration-200 p-2 rounded-lg hover:bg-red-600/20"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </motion.button>

                    {/* Volume */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-600/20 transition"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded appearance-none cursor-pointer accent-red-600 hover:accent-red-500"
                      />
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Playback Rate */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        className="text-white hover:text-red-600 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-red-600/20 transition duration-200"
                      >
                        {playbackRate}x
                      </motion.button>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute right-0 bottom-full mb-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 backdrop-blur-sm"
                      >
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <motion.button
                            key={rate}
                            whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', paddingLeft: '20px' }}
                            onClick={() => handlePlaybackRate(rate)}
                            className={`block w-full text-left px-4 py-2 text-sm transition duration-200 rounded-md ${
                              playbackRate === rate
                                ? 'text-red-600 font-bold bg-red-600/10'
                                : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            {rate}x
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* Theater Mode */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsTheaterMode(!isTheaterMode)}
                      className={`text-white transition duration-200 p-2 rounded-lg ${
                        isTheaterMode 
                          ? 'bg-red-600/30 text-red-600' 
                          : 'hover:text-red-600 hover:bg-red-600/20'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4-4l5-5m11 5v-4m0 4h-4m4-4l-5-5"
                        />
                      </svg>
                    </motion.button>

                    {/* Fullscreen */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleFullscreen}
                      className="text-white hover:text-red-600 transition duration-200 p-2 rounded-lg hover:bg-red-600/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4-4l5-5m11 5v-4m0 4h-4m4-4l-5-5"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-red-600 z-10 text-3xl"
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
