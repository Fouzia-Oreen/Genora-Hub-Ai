import 'dotenv/config'; 
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import connectDb from './config/db.js';
import connectCloudinary from './config/cloudinary.js';


// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;


// --- MIDDLEWARE ---
// Use helmet for security headers
app.use(helmet());


// const allowedOrigins = [
//   process.env.FRONTEND_URL, 
// ];

const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://genoraai.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
// Use the configured CORS middleware
app.use(cors(corsOptions));

// Use compression to make responses faster
app.use(compression());

// Use morgan for request logging
app.use(morgan('dev'));

// Parse incoming JSON requests
app.use(express.json());

// --- DATABASE CONNECTION ---
connectCloudinary();
connectDb();


// Test route
// app.get('/', (req, res) => {
//   res.send('Genora-Hub-Ai Server is running!');
// });

// Clerk middleware applied globally for all routes
app.use(clerkMiddleware()); 


// --- API ROUTES ---
// Apply requireAuth specifically to the API routes
app.use('/api/ai', requireAuth(), aiRoutes);
app.use('/api/user', requireAuth(), userRoutes);
app.use('/api/resume', requireAuth(), resumeRoutes);


// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});