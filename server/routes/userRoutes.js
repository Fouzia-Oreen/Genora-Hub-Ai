import express from 'express';
import { upload } from '../config/multer.js';
import { auth } from '../middlewares/auth.js';

import {
    deleteCreation,
    getPublishedCreations,
    getUserCreations,
    getUserProfile,
    toggleLikedCreations,
    uploadProfileImage
} from '../controllers/userController.js';

const userRouter = express.Router();

// --- Existing User Routes ---
userRouter.get('/profile', auth, getUserProfile);
userRouter.post('/profile/image', upload.single('profileImage'), auth, uploadProfileImage);

userRouter.get('/creations', auth, getUserCreations);
userRouter.get('/creations/published', auth, getPublishedCreations); 
userRouter.post('/creations/toggle-like', auth, toggleLikedCreations);
userRouter.delete('/creations/:id', auth, deleteCreation);


export default userRouter;