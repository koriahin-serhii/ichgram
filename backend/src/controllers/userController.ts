import { Request, Response } from 'express';
import User from '../models/userModel.js';

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
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const { name, bio } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (file) {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
        'base64'
      )}`;
      updateData.profileImage = base64Image;
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
