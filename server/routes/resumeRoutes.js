import express from 'express';
import { createResume, deleteUserResume, getResumesById, getUsersResume, updateUserResume, uploadProfileImage, uploadThumbnail } from "../controllers/resumeController.js";
import { auth } from "../middlewares/auth.js";
import { upload } from '../config/multer.js';

const resumeRouter = express.Router();


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
    uploadThumbnail
);
resumeRouter.post('/upload-profile-image/:id', auth, upload.single('profileImage'), uploadProfileImage);



export default resumeRouter;