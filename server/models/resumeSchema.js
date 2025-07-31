import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,  
  },
  thumbnailLink: {
    type: String,
    colorPalette: [true],
  },
  // thumbnailLink: { type: String,},
  // colorPalette: { type: [String], default: [] },
  profileInfo: {
    profilePreviewUrl: String,
    fullName: String,
    description: String,
    summary: String,
  },
  contactInfo: {
    email: String,
    phone: String,
    location: String,
    linkedIn: String,
    github: String,
    website: String,
  },
  workExperience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    startDate: String,
    endDate: String,
  }],
  skills: [{
    name: String,
    progress: Number, 
  }],
  projects: [{
    title: String,
    description: String,
    github: String,
    liveDemo: String,
  }],
  certification: [{
    title: String,
    issuer: String,
    year: String,
  }],
  language: [{
    name: String,
    progress: Number, 
  }],
  reference: [{
    name: String,
    designation: String,
    company: String,
    phone: String,
  }],
  interests: [String] 
}, {
  timestamps: true 
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;