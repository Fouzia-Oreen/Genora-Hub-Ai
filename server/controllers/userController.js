import cloudinary from 'cloudinary';
import fs from 'fs';
import Creation from '../models/creationSchema.js';
import Resume from '../models/resumeSchema.js';
import User from '../models/userSchema.js';

// Configure Cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// --- USER CREATIONS CONTROLLERS ---
const getClerkUserId = (req) => {
  return req.user?.clerkUserId || null;
};

// Helper to get MongoDB User _id from req.user
const getMongoUserId = (req) => {
  return req.user?._id || null;
};

export const getUserCreations = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }

    // Find creations by userId in MongoDB
    const creations = await Creation.find({ userId: clerkUserId }).sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, creations: creations || [] });
  } catch (error) {
    console.error('Error fetching user creations:', error);
    res.status(500).json({ success: false, message: 'Error fetching user creations', error: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await Creation.find({ publish: true }).sort({ createdAt: -1 }); 

    console.log('Backend: getPublishedCreations - Fetched rows count:', creations.length);


    res.status(200).json({ success: true, creations: creations || [] });
  } catch (error) {
    console.error('Error fetching published creations:', error);
    res.status(500).json({ success: false, message: 'Error fetching published creations', error: error.message });
  }
};

export const toggleLikedCreations = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req); 
    const { id: creationId } = req.body; 

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }
    if (!creationId) {
      return res.status(400).json({ success: false, message: 'Creation ID is required.' });
    }

    const creation = await Creation.findById(creationId);

    if (!creation) {
      return res.status(404).json({ success: false, message: 'Creation not found.' });
    }

    const currentLikes = creation.likes || [];

    let updatedLikes;
    let message;

    if (currentLikes.includes(clerkUserId)) {
      updatedLikes = currentLikes.filter((user_id) => user_id !== clerkUserId);
      message = 'Creation unliked.';
    } else {
      updatedLikes = [...currentLikes, clerkUserId];
      message = 'Creation liked!';
    }

    await Creation.updateOne(
      { _id: creationId },
      { $set: { likes: updatedLikes } } 
    );

    res.status(200).json({ success: true, message, updatedLikes });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Error toggling like', error: error.message });
  }
};

export const deleteCreation = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);
    const { id: creationId } = req.params; 

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }
    if (!creationId) {
      return res.status(400).json({ success: false, message: 'Creation ID is required.' });
    }

    const creation = await Creation.findById(creationId);

    if (!creation) {
      return res.status(404).json({ success: false, message: 'Creation not found.' });
    }

    if (creation.userId !== clerkUserId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete this creation.' });
    }

    if (creation.type.startsWith('image') && creation.content.includes('res.cloudinary.com')) {
      try {
        const publicIdMatch = creation.content.match(/\/v\d+\/(Genora\/.*?)\./);
        if (publicIdMatch && publicIdMatch[1]) {
          const publicId = publicIdMatch[1];
          await cloudinary.uploader.destroy(publicId);
          console.log(`Cloudinary image ${publicId} deleted.`);
        }
      } catch (deleteError) {
        console.warn(`Failed to delete old profile image ${publicId}:`, deleteError.message);
      }
    }

    await Creation.findByIdAndDelete(creationId);

    res.status(200).json({ success: true, message: 'Creation deleted successfully.' });
  } catch (error) {
    console.error('Error deleting creation:', error);
    res.status(500).json({ success: false, message: 'Error deleting creation', error: error.message });
  }
};


// --- USER PROFILE CONTROLLERS ---
export const getUserProfile = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }

    const userProfile = await User.findOne({ clerkUserId: clerkUserId });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    res.status(200).json({ success: true, user: userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching user profile', error: error.message });
  }
} 

export const uploadProfileImage = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);
    const imageFile = req.file; 

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const user = await User.findOne({ clerkUserId: clerkUserId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Upload new image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'Genora/profile_images', 
      public_id: `profile_${clerkUserId}_${Date.now()}`,
      overwrite: true, 
      quality: 'auto',
      fetch_format: 'auto', 
    });

    // If there was an old image, delete it from Cloudinary
    if (user.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profileImagePublicId);
        console.log(`Old profile image ${user.profileImagePublicId} deleted from Cloudinary.`);
      } catch (deleteError) {
        console.warn(`Failed to delete old profile image ${user.profileImagePublicId}:`, deleteError.message);
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: clerkUserId },
      {
        $set: {
          profileImageUrl: uploadResult.secure_url,
          profileImagePublicId: uploadResult.public_id,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully.',
      profileImageUrl: updatedUser.profileImageUrl,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ success: false, message: error.message || 'An error occurred during image upload.' });
  } finally {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
  }
};


// --- NEW RESUME MANAGEMENT CONTROLLERS ---

export const createResume = async (req, res) => {
  try {
    const mongoUserId = getMongoUserId(req); 
    const { plan, builtResumeDailyCount } = req.user;
    const resumeData = req.body; 

    if (!mongoUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }

    // Apply daily usage limit for 'studio' plan
    if (plan === 'studio' && builtResumeDailyCount >= 10) { 
      return res.json({ success: false, message: 'Daily usage limit exceeded for Built Your Resume (10 per day). Try again tomorrow.' });
    }
    // Launch and Creator plans do not have access to this feature
    if (plan === 'launch' || plan === 'creator') {
      return res.status(403).json({ success: false, message: 'This feature is not available for your current plan. Upgrade to Studio.' });
    }

    // Create a new Resume document
    const newResume = await Resume.create({
      userId: mongoUserId, 
      ...resumeData, 
    });

    // Increment usage for 'studio' plan in MongoDB
    if (plan === 'studio') {
      await User.updateOne(
        { _id: mongoUserId },
        { $inc: { builtResumeDailyCount: 1 } }
      );
    }

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

    // Find all resumes belonging to the authenticated user
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
    const mongoUserId = getMongoUserId(req); // Get MongoDB's _id from req.user
    const { id: resumeId } = req.params; // Get resume ID from URL parameters

    if (!mongoUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }
    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'Resume ID is required.' });
    }

    // Find and delete the resume by its _id and ensure it belongs to the authenticated user
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


