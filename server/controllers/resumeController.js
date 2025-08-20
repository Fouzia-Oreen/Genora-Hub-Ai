import cloudinary from 'cloudinary';
import Resume from '../models/resumeSchema.js';
import User from '../models/userSchema.js';
import Creation from '../models/creationSchema.js';
import fs from "fs";


// Configure Cloudinary once
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, 
});

// Helper function to get MongoDB user ID
const getMongoUserId = (req) => req.user?._id || null;
const getClerkUserId = (req) => {
    return req.user?.clerkUserId || null;
};
/* --- NEW RESUME MANAGEMENT CONTROLLERS --- */
export const createResume = async (req, res) => {
    try {
       // const mongoUserId = getMongoUserId(req);
        const clerkUserId = getClerkUserId(req);
        const { plan } = req.user;
        const { title } = req.body;
        const defaultResumeUserData = {
            profileInfo: { profileImg: null, profilePreviewUrl: "", fullName: "", designation: "", summary: "" },
            contactInfo: { email: "", phone: "", location: "", linkedIn: "", github: "", website: "" },
            workExperience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
            education: [{ degree: "", institution: "", startDate: "", endDate: "", description: "" }],
            skills: [{ name: "", progress: 0, }],
            projects: [{ title: "", description: "", github: "", liveDemo: "", }],
            certifications: [{ title: "", issuer: "", year: "", }],
            languages: [{ name: "", progress: 0, }],
            references: [{ name: "", designation: "", company: "", phone: "", email: "" }],
            interests: [""]
        };
    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }

    if (plan === 'launch') {
      return res.status(403).json({ success: false, message: 'Your current plan does not allow creating resumes. Upgrade to Creative or Studio.' });
    }

    if (plan === 'creative') {
      const resumeCount = await Resume.countDocuments({ userId: req.user._id }); 
      const creativePlanLimit = 3;

      if (resumeCount >= creativePlanLimit) {
        return res.status(403).json({ success: false, message: 'You have reached the limit of 3 resumes for the Creative plan. Please upgrade to Studio to create more.' });
      }
    }

        const newResume = await Resume.create({ userId: req.user._id, title, ...defaultResumeUserData });

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
    const mongoUserId = req.user?._id;
    if (!mongoUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
    }

    const userResumes = await Resume.find({ userId: mongoUserId }).sort({updatedAt: -1}).lean();

    return res.status(200).json({
      success: true,
      message: userResumes.length ? 'Resumes fetched successfully.' : 'No resumes found for this user.',
      resumes: userResumes,
    });
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user resumes',
      error: error.message,
    });
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

        const resume = await Resume.findOne({ _id: resumeId, userId: mongoUserId }).lean();
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

        const deletedResume = await Resume.findOneAndDelete({ _id: resumeId, userId: mongoUserId });

        if (!deletedResume) {
            return res.status(404).json({ success: false, message: 'Resume not found or you do not have permission to delete it.' });
        }

        await Creation.findOneAndDelete({ creationId: resumeId, userId: mongoUserId, type: 'resume' });

        if (deletedResume.thumbnailPublicId) {
            try {
                await cloudinary.v2.uploader.destroy(deletedResume.thumbnailPublicId);
                console.log(`Cloudinary thumbnail ${deletedResume.thumbnailPublicId} deleted successfully.`);
            } catch (cloudinaryError) {
                console.warn(`Failed to delete Cloudinary thumbnail ${deletedResume.thumbnailPublicId}:`, cloudinaryError.message);
            }
        }

        res.status(200).json({ success: true, message: 'Resume deleted successfully!' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ success: false, message: 'Error deleting resume', error: error.message });
    }
};

export const uploadThumbnail = async (req, res) => {
    const mongoUserId = getMongoUserId(req);
    const clerkUserId = req.user.clerkUserId;
    const { id: resumeId } = req.params;
    const imageFile = req.file;

    try {
        
        if (!mongoUserId || !clerkUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'No thumbnail file provided.' });
        }
        if (!resumeId) {
            return res.status(400).json({ success: false, message: 'Resume ID is required.' });
        }

        const publicId = `resume_thumbnail_${clerkUserId}_${Date.now()}`;
        const folder = 'Genora/resume_thumbnails';
        const query = { _id: resumeId, userId: mongoUserId };

        const document = await Resume.findOne(query);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Resume not found or you do not have permission to access it.' });
        }

        if (document.thumbnailPublicId) {
            await cloudinary.v2.uploader.destroy(document.thumbnailPublicId);
        }

        const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path, {
            folder: folder,
            public_id: publicId,
            quality: 'auto',
            fetch_format: 'auto',
        });

        const updatedDocument = await Resume.findOneAndUpdate(
            query,
            { $set: { thumbnailLink: uploadResult.secure_url, thumbnailPublicId: uploadResult.public_id } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Thumbnail updated successfully.',
            imageUrl: updatedDocument.thumbnailLink,
        });

    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        res.status(500).json({ success: false, message: error.message || 'An error occurred during thumbnail upload.' });
    } finally {
        if (imageFile && imageFile.path) {
            fs.unlink(imageFile.path, (err) => {
                if (err) console.error('Error deleting temp thumbnail file:', err);
            });
        }
    }
};

export const uploadProfileImage = async (req, res) => {
    const mongoUserId = getMongoUserId(req);
    const clerkUserId = req.user.clerkUserId;
    const imageFile = req.file;

    try {
        if (!mongoUserId || !clerkUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'No profile image file provided.' });
        }

        const publicId = `profile_image_${clerkUserId}_${Date.now()}`;
        const folder = 'Genora/profile_images';
        const query = { clerkUserId: clerkUserId };

        const document = await User.findOne(query);
        if (!document) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (document.profileImagePublicId) {
            await cloudinary.v2.uploader.destroy(document.profileImagePublicId);
        }

        const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path, {
            folder: folder,
            public_id: publicId,
            quality: 'auto',
            fetch_format: 'auto',
        });

        const updatedDocument = await User.findOneAndUpdate(
            query,
            { $set: { profileImageUrl: uploadResult.secure_url, profileImagePublicId: uploadResult.public_id } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile image updated successfully.',
            imageUrl: updatedDocument.profileImageUrl,
        });

    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ success: false, message: error.message || 'An error occurred during profile image upload.' });
    } finally {
        if (imageFile && imageFile.path) {
            fs.unlink(imageFile.path, (err) => {
                if (err) console.error('Error deleting temp profile image file:', err);
            });
        }
    }
};