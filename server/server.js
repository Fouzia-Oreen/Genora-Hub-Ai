import { clerkMiddleware, requireAuth } from '@clerk/express';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDb from './config/db.js';
import { auth } from './middlewares/auth.js';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';

const PORT = 3090;
const app = express();

const startServer = async () => {
  await connectCloudinary();
  await connectDb(); 

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(clerkMiddleware());

  //  Public route
  app.get('/', (req, res) => {
    res.send('Welcome to the Genora Hub AI Server!');
  });

  //  Protected routes
  app.use('/api/ai', requireAuth(), auth, aiRouter);
  app.use('/api/user', requireAuth(), auth, userRouter);

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
