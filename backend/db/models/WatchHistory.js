import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0 // seconds watched
    },
    totalDuration: {
      type: Number,
      default: 0 // total video duration in seconds
    },
    completed: {
      type: Boolean,
      default: false // true if user watched >= 90% of video
    },
    quality: {
      type: String,
      enum: ['480p', '720p', '1080p', '4K'],
      default: '720p'
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'tablet', 'mobile'],
      default: 'desktop'
    }
  },
  { timestamps: true }
);

// Index for efficient queries
watchHistorySchema.index({ userId: 1, watchedAt: -1 });
watchHistorySchema.index({ userId: 1, videoId: 1 });
watchHistorySchema.index({ watchedAt: -1 }); // For trending videos

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

export default WatchHistory;
