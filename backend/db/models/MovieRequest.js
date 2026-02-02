import mongoose from 'mongoose';

const movieRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: 200
    },
    type: {
      type: String,
      enum: ['movie', 'series', 'documentary'],
      default: 'movie'
    },
    description: {
      type: String,
      maxlength: 2000,
      default: null
    },
    requestedBy: {
      type: String, // Can be email or username
      required: true,
      trim: true
    },
    requestedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: null
    },
    additionalDetails: {
      year: { type: Number, default: null },
      director: { type: String, default: null },
      genre: { type: String, default: null },
      imdbUrl: { type: String, default: null }
    },
    votes: {
      type: Number,
      default: 1 // Requester counts as 1 vote
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

// Index for efficient queries
movieRequestSchema.index({ status: 1, createdAt: -1 });
movieRequestSchema.index({ requestedByUser: 1 });
movieRequestSchema.index({ title: 1 });

const MovieRequest = mongoose.model('MovieRequest', movieRequestSchema);

export default MovieRequest;
