import { GoogleGenerativeAI } from '@google/generative-ai';
import cloudinary from 'cloudinary';
import OpenAI from 'openai';
import Resume from '../models/resumeSchema.js';
import User from '../models/userSchema.js';



// Initialize OpenAI client for Gemini API
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configure Cloudinary once
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, 
});

// --- HELPER FUNCTIONS ---
const getClerkUserId = (req) => {
    return req.user?.clerkUserId || null;
};

const getMongoUserId = (req) => {
    return req.user?._id || null;
};

// Reusable function to check and handle usage limits
const checkUsageLimit = (user, feature, limit) => {

  if (user.plan === 'launch' && user.freeUsage >= limit) {
      return { success: false, status: 403, message: 'Free usage limit exceeded. Upgrade to creator for more requests.' };
  }
  // Add other plan-specific checks here
  if (feature === 'youtubeScript' && user.plan === 'creator' && user.youtubeScriptDailyCount >= 10) {
      return { success: false, status: 403, message: 'Daily usage limit exceeded for YouTube Script Generation. Try again tomorrow.' };
  }
  if (feature === 'imageGeneration' && user.plan === 'creator' && user.imageGenerationDailyCount >= 10) {
        return { success: false, status: 403, message: 'Daily usage limit exceeded for Image Generation. Try again tomorrow.' };
  }
  if (feature === 'builtResume' && user.plan === 'studio' && user.builtResumeDailyCount >= 10) {
      return { success: false, status: 403, message: 'Daily usage limit exceeded for Built Your Resume (10 per day). Try again tomorrow.' };
  }
  if (feature === 'reviewResume' && (user.plan === 'creator' || user.plan === 'studio') && user.reviewResumeDailyCount >= 3) {
      return { success: false, status: 403, message: 'Daily usage limit exceeded for Resume Review (3 per day). Try again tomorrow.' };
  }
  if (feature === 'emailResponse' && user.plan === 'creator' && user.emailResponseDailyCount >= 10) {
        return { success: false, status: 403, message: 'Daily usage limit exceeded for Email Generation. Try again tomorrow.' };
  }
  if (feature === 'coverLetter' && user.plan === 'creator' && user.coverLetterDailyCount >= 5) {
        return { success: false, status: 403, message: 'Daily usage limit exceeded for Cover Letter Generation. Try again tomorrow.' };
  }

  return { success: true };
};

// Helper function to update usage count
const updateUsageCount = async (user, feature) => {
    let updateField;
    if (user.plan === 'launch') {
        updateField = 'freeUsage';
    } else if (feature === 'youtubeScript' && user.plan === 'creator') {
        updateField = 'youtubeScriptDailyCount';
    } else if (feature === 'imageGeneration' && user.plan === 'creator') {
        updateField = 'imageGenerationDailyCount';
    } else if (feature === 'builtResume' && user.plan === 'studio') {
        updateField = 'builtResumeDailyCount';
    } else if (feature === 'reviewResume' && (user.plan === 'creator' || user.plan === 'studio')) {
        updateField = 'reviewResumeDailyCount';
    } else if (feature === 'emailResponse' && user.plan === 'creator') {
        updateField = 'emailResponseDailyCount';
    } else if (feature === 'coverLetter' && user.plan === 'creator') {
        updateField = 'coverLetterDailyCount';
    } else {
        // No usage limit for this plan/feature combination
        return;
    }

    await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { [updateField]: 1 } }
    );
};


/* --- NEW RESUME MANAGEMENT CONTROLLERS --- */
export const createResume = async (req, res) => {
    try {
        const mongoUserId = getMongoUserId(req);
        const { plan, builtResumeDailyCount } = req.user;
        const resumeData = req.body;

        if (!mongoUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (plan !== 'studio') {
            return res.status(403).json({ success: false, message: 'This feature is not available for your current plan. Upgrade to Studio.' });
        }

        const usageCheck = checkUsageLimit(req.user, 'builtResume', 10);
        if (!usageCheck.success) {
            return res.status(usageCheck.status).json({ success: false, message: usageCheck.message });
        }

        const newResume = await Resume.create({ userId: mongoUserId, ...resumeData });
        await updateUsageCount(req.user, 'builtResume');

        res.status(201).json({ success: true, message: 'Resume created successfully!', resume: newResume });
    } catch (error) {
        console.error('Error creating resume:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message, errors: error.errors });
        }
        res.status(500).json({ success: false, message: 'Error creating resume', error: error.message });
    }
};

export const getUsersResume = async (req, res) => {
    try {
        const mongoUserId = getMongoUserId(req);
        if (!mongoUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }

        const resumes = await Resume.find({ userId: mongoUserId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, resumes: resumes || [] });
    } catch (error) {
        console.error('Error fetching user resumes:', error);
        res.status(500).json({ success: false, message: 'Error fetching user resumes', error: error.message });
    }
};

export const getResumesById = async (req, res) => {
    try {
        const mongoUserId = getMongoUserId(req);
        const { id: resumeId } = req.params;

        if (!mongoUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (!resumeId) {
            return res.status(400).json({ success: false, message: 'Resume ID is required.' });
        }

        const resume = await Resume.findOne({ _id: resumeId, userId: mongoUserId });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found or you do not have permission to access it.' });
        }

        res.status(200).json({ success: true, resume });
    } catch (error) {
        console.error('Error fetching resume by ID:', error);
        res.status(500).json({ success: false, message: 'Error fetching resume by ID', error: error.message });
    }
};

export const updateUserResume = async (req, res) => {
    try {
        const mongoUserId = getMongoUserId(req);
        const { id: resumeId } = req.params;
        const updateData = req.body;

        if (!mongoUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (!resumeId) {
            return res.status(400).json({ success: false, message: 'Resume ID is required.' });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No update data provided.' });
        }

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId: mongoUserId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ success: false, message: 'Resume not found or you do not have permission to update it.' });
        }

        res.status(200).json({ success: true, message: 'Resume updated successfully!', resume: updatedResume });
    } catch (error) {
        console.error('Error updating resume:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message, errors: error.errors });
        }
        res.status(500).json({ success: false, message: 'Error updating resume', error: error.message });
    }
};

export const deleteUserResume = async (req, res) => {
    try {
        const mongoUserId = getMongoUserId(req);
        const { id: resumeId } = req.params;

        if (!mongoUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (!resumeId) {
            return res.status(400).json({ success: false, message: 'Resume ID is required.' });
        }

        const deletedResume = await Resume.findOneAndDelete({ _id: resumeId, userId: mongoUserId });
        if (!deletedResume) {
            return res.status(404).json({ success: false, message: 'Resume not found or you do not have permission to delete it.' });
        }

        res.status(200).json({ success: true, message: 'Resume deleted successfully!' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ success: false, message: 'Error deleting resume', error: error.message });
    }
};
