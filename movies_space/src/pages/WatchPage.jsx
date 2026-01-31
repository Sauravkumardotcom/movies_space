import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideoById } from '../hooks/useVideos';
import VideoPlayer from '../components/VideoPlayer';
import { useAppStore } from '../store/useAppStore';

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Don't parse as integer - allow both numeric and custom string IDs
  const { data: video, isLoading } = useVideoById(id);
  const { addToWatchHistory } = useAppStore();

  React.useEffect(() => {
    if (video) {
      addToWatchHistory(video);
    }
  }, [video, addToWatchHistory]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Video not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer video={video} onClose={() => navigate(-1)} />
  );
};

export default WatchPage;
