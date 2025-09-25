import { Request, Response } from 'express';
import User from '../models/userModel.js';
import { Types } from 'mongoose';
import {
  uploadProfileImageToS3,
  deleteProfileImageFromS3,
} from '../utils/s3.js';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
  file?: Express.Multer.File;
}

interface UpdateProfileData {
  name?: string;
  bio?: string;
  profileImage?: string;
}

// Getting user profile by ID (without password)
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Updating profile (name, bio, avatar)
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user;
    const { name, bio } = req.body;
    const updateData: UpdateProfileData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (req.file) {
      // Get the user to delete the old avatar
      const user = await User.findById(userId);
      if (user && user.profileImage && user.profileImage.startsWith('http')) {
        await deleteProfileImageFromS3(user.profileImage);
      }
      // Upload new avatar to S3
      updateData.profileImage = await uploadProfileImageToS3(
        req.file.buffer,
        req.file.mimetype,
        String(userId)
      );
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
