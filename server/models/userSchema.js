// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true, 
    index: true,  
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  profileImageUrl: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    trim: true,
  },
  plan: {
    type: String,
    enum: ['launch', 'creator', 'studio'],
    default: 'launch',
  },
  imageGenerationDailyCount: {
    type: Number,
    default: 0,
  },
  reviewResumeDailyCount: {
    type: Number,
    default: 0,
  },
  builtResumeDailyCount: {
    type: Number,
    default: 0,
  },
  emailResponseLastDate: { type: String, default: '1970-01-01' },
  imageGenerationLastDate: { type: String, default: '1970-01-01' },
  youtubeScriptLastDate: { type: String, default: '1970-01-01' },
  reviewResumeLastDate: { type: String, default: '1970-01-01' },
  builtResumeLastDate: { type: String, default: '1970-01-01' },
  freeUsage: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, 
});

const User = mongoose.model('User', userSchema);

export default User;
