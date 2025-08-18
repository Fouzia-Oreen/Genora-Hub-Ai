import express from 'express';
import { createResume, deleteUserResume, getResumesById, getUsersResume, updateUserResume, uploadProfileImage, uploadThumbnail } from "../controllers/resumeController.js";
import { auth } from "../middlewares/auth.js";
import { upload } from '../config/multer.js';

const resumeRouter = express.Router();

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error('Multer error:', err);
        return res.status(400).json({ success: false, message: 'Multer error during file upload.' });
    } else if (err) {
        // An unknown error occurred.
        console.error('Unknown upload error:', err);
        return res.status(500).json({ success: false, message: 'An unknown error occurred.' });
    }
    next();
};

// --- NEW RESUME ROUTES ---
resumeRouter.post('/', auth, createResume);
resumeRouter.get('/', auth, getUsersResume);
resumeRouter.get('/:id', auth, getResumesById);
resumeRouter.put('/:id', auth, updateUserResume);
resumeRouter.delete('/:id', auth, deleteUserResume);

// Dedicated routes for image uploads
resumeRouter.post(
    '/upload-thumbnail/:id', 
    auth, 
    upload.single('thumbnail'), 
    handleMulterError,
    uploadThumbnail
);
resumeRouter.post('/upload-profile-image/:id', auth, upload.single('profileImage'), uploadProfileImage);



export default resumeRouter;