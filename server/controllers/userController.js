import cloudinary from 'cloudinary';
import fs from 'fs';
import Creation from '../models/creationSchema.js';
import User from '../models/userSchema.js';
import Resume from '../models/resumeSchema.js';


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

/* --- USER CREATIONS CONTROLLERS --- */
export const getUserCreations = async (req, res) => {
    try {
        const clerkUserId = getClerkUserId(req);

        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }

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
        const isLiked = currentLikes.includes(clerkUserId);
        const updatedLikes = isLiked ? currentLikes.filter((user_id) => user_id !== clerkUserId) : [...currentLikes, clerkUserId];
        const message = isLiked ? 'Creation unliked.' : 'Creation liked!';

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

        // Handle Cloudinary image deletion
        if (creation.type.startsWith('image') && creation.content.includes('res.cloudinary.com')) {
            try {
                // Extract public ID from the URL
                const publicIdMatch = creation.content.match(/\/v\d+\/(Genora\/.*?)\./);
                if (publicIdMatch && publicIdMatch[1]) {
                    const publicId = publicIdMatch[1];
                    await cloudinary.v2.uploader.destroy(publicId);
                    console.log(`Cloudinary image ${publicId} deleted.`);
                }
            } catch (deleteError) {
                console.warn(`Failed to delete old image from Cloudinary:`, deleteError.message);
            }
        }

        await Creation.findByIdAndDelete(creationId);
        res.status(200).json({ success: true, message: 'Creation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting creation:', error);
        res.status(500).json({ success: false, message: 'Error deleting creation', error: error.message });
    }
};


/* --- USER PROFILE CONTROLLERS --- */
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
};

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

        // Delete old image from Cloudinary if it exists
        if (user.profileImagePublicId) {
            try {
                await cloudinary.v2.uploader.destroy(user.profileImagePublicId);
                console.log(`Old profile image ${user.profileImagePublicId} deleted from Cloudinary.`);
            } catch (deleteError) {
                console.warn(`Failed to delete old profile image ${user.profileImagePublicId}:`, deleteError.message);
            }
        }

        // Upload new image to Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path, {
            folder: 'Genora/profile_images',
            public_id: `profile_${clerkUserId}_${Date.now()}`,
            quality: 'auto',
            fetch_format: 'auto',
        });

        // Update user document with new image URL and public ID
        const updatedUser = await User.findOneAndUpdate(
            { clerkUserId: clerkUserId },
            { $set: {
                profileImageUrl: uploadResult.secure_url,
                profileImagePublicId: uploadResult.public_id,
              }
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


export const uploadImage = async (req, res) => {
    try {
        const clerkUserId = getClerkUserId(req);
        const { type } = req.params; 
        const imageFile = req.file;

        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found.' });
        }
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'No image file provided.' });
        }

        let model, query, updateFields, folder;
        const publicId = `${type}_${clerkUserId}_${Date.now()}`;

        switch (type) {
            case 'profile':
                model = User;
                query = { clerkUserId: clerkUserId };
                updateFields = (url, publicId) => ({
                    profileImageUrl: url,
                    profileImagePublicId: publicId
                });
                folder = 'Genora/profile_images';
                break;
            case 'resume':
                // Assuming you're passing the resume ID in the request body or as a parameter
                const { resumeId } = req.body; 
                if (!resumeId) {
                    return res.status(400).json({ success: false, message: 'Resume ID is required for resume image upload.' });
                }
                model = Resume;
                query = { _id: resumeId, userId: clerkUserId };
                updateFields = (url, publicId) => ({
                    thumbnailLink: url,
                    thumbnailPublicId: publicId 
                });
                folder = 'Genora/resume_thumbnails';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid image type provided.' });
        }

        // Find the document to be updated
        const document = await model.findOne(query);
        if (!document) {
            return res.status(404).json({ success: false, message: `${type} document not found.` });
        }

        const oldPublicId = type === 'profile' ? document.profileImagePublicId : document.thumbnailPublicId;
        if (oldPublicId) {
            try {
                await cloudinary.v2.uploader.destroy(oldPublicId);
                console.log(`Old ${type} image ${oldPublicId} deleted from Cloudinary.`);
            } catch (deleteError) {
                console.warn(`Failed to delete old ${type} image ${oldPublicId}:`, deleteError.message);
            }
        }

        // Upload new image to Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path, {
            folder: folder,
            public_id: publicId,
            quality: 'auto',
            fetch_format: 'auto',
        });

        // Update the document with new image URL and public ID
        const updatedDocument = await model.findOneAndUpdate(
            query,
            { $set: updateFields(uploadResult.secure_url, uploadResult.public_id) },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: `${type} image updated successfully.`,
            imageUrl: updatedDocument.profileImageUrl || updatedDocument.thumbnailLink, 
        });

    } catch (error) {
        console.error(`Error uploading ${req.params.type} image:`, error);
        res.status(500).json({ success: false, message: error.message || 'An error occurred during image upload.' });
    } finally {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }
    }
};