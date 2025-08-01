import { createResume, deleteUserResume, getResumesById, getUsersResume, updateUserResume } from "../controllers/resumeController.js";
import { auth } from "../middlewares/auth.js";
import express from 'express';


const resumeRouter = express.Router();

// --- NEW RESUME ROUTES ---
resumeRouter.post('/resumes', auth, createResume); 
resumeRouter.get('/resumes', auth, getUsersResume); 
resumeRouter.get('/resumes/:id', auth, getResumesById); 
resumeRouter.put('/resumes/:id', auth, updateUserResume); 
resumeRouter.delete('/resumes/:id', auth, deleteUserResume); 

export default resumeRouter;