import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      maxlength: 2000,
      default: null
    },
    url: {
      type: String,
      required: [true, 'Video URL is required']
    },
    thumbnail: {
      type: String,
      default: null // URL to thumbnail image
    },
    poster: {
      type: String,
      default: null // URL to poster image
    },
    duration: {
      type: Number,
      default: null // in seconds
    },
    genre: [
      {
        type: String,
        trim: true
      }
    ],
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null
    },
    releaseDate: {
      type: Date,
      default: null
    },
    director: {
      type: String,
      default: null
    },
    cast: [
      {
        type: String,
        trim: true
      }
    ],
    language: {
      type: String,
      default: 'en'
    },
    subtitle: {
      type: Boolean,
      default: false
    },
    quality: {
      type: String,
      enum: ['480p', '720p', '1080p', '4K'],
      default: '720p'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending'
    },
    metadata: {
      omdbId: { type: String, default: null },
      imdbRating: { type: Number, default: null },
      source: { type: String, enum: ['upload', 'omdb', 'external'], default: 'upload' }
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  { timestamps: true }
);

// Index for searching
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ genre: 1 });
videoSchema.index({ uploadedBy: 1 });
videoSchema.index({ status: 1 });
videoSchema.index({ createdAt: -1 });

const Video = mongoose.model('Video', videoSchema);

export default Video;
