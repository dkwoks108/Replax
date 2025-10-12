import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/replax';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    // In this development container we may not have MongoDB running.
    // Log the error and continue so the API can start for local frontend development.
    console.warn('MongoDB connection warning: could not connect. Continuing without DB in dev.');
    console.warn(String(error));
  }
};

export default connectDB;
