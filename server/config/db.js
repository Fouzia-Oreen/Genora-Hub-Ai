import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI environment variable is not set.');
      process.exit(1);
    }

    await mongoose.connect(uri, {
      serverApi: {
        version: mongoose.version >= '6.0.0' ? '1' : undefined,
        strict: true,
        deprecationErrors: true,
      },
      dbName: process.env.MONGODB_DB_URI || 'genora_ai_db', 
      maxPoolSize: 10, 
      minPoolSize: 2, 
      maxIdleTimeMS: 30000, 
      connectTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
    });

    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  }
};


export default connectDb;