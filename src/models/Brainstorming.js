import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
  },
  image: {
    type: String, // URL atau path ke gambar
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ideaSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
  },
  image: {
    type: String, // URL atau path ke gambar
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  votes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
});

const brainstormingSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creator: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
    participants: {
      type: [String],
    },
    ideas: [ideaSchema],
    views: {
      type: Number,
      default: 0, // Set default views to 0
    },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array untuk menyimpan user ID
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

const Brainstorming = mongoose.model(
  "Brainstorming",
  brainstormingSessionSchema
);

export default Brainstorming;
