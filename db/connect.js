import mongoose from 'mongoose';

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

export default connectDB;
