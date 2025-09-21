import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URL: string | undefined = process.env.MONGODB_URI;

const connectDB = async (): Promise<void> => {
  try {
    if (!URL) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(URL);
    console.log('MongoDB connected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MongoDB connection error:', error.message);
    } else {
      console.error('MongoDB connection error:', error);
    }
    process.exit(1);
  }
};

export default connectDB;
