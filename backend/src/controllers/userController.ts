import { Request, Response } from 'express';
import User from '../models/userModel.js';
import { Types } from 'mongoose';

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
      updateData.profileImage = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString('base64')}`;
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
