import { Request, Response } from 'express';
import User from '../models/userModel.js';
import PostModel from '../models/postModel.js';
import CommentModel from '../models/commentModel.js';
import LikeModel from '../models/likeModel.js';
import FollowModel from '../models/followModel.js';
import MessageModel from '../models/messageModel.js';
import NotificationModel from '../models/notificationModel.js';
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
  website?: string;
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
    const { name, bio, website } = req.body;
    const updateData: UpdateProfileData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (website !== undefined) updateData.website = website; // Allow empty string to clear website
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

// Delete user profile and all related data
export const deleteProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user;

    // Find user to get profile image
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile image from S3 if exists
    if (user.profileImage && user.profileImage.startsWith('http')) {
      await deleteProfileImageFromS3(user.profileImage);
    }

    // Get all user's posts to delete their images
    const userPosts = await PostModel.find({ author: userId });
    for (const post of userPosts) {
      if (post.imageUrl && post.imageUrl.startsWith('http')) {
        await deleteProfileImageFromS3(post.imageUrl);
      }
    }

    // Delete all related data
    await Promise.all([
      // Delete user's posts
      PostModel.deleteMany({ author: userId }),
      // Delete user's comments
      CommentModel.deleteMany({ user: userId }),
      // Delete user's likes
      LikeModel.deleteMany({ user: userId }),
      // Delete follows where user is follower or following
      FollowModel.deleteMany({ $or: [{ follower: userId }, { following: userId }] }),
      // Delete user's messages
      MessageModel.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      // Delete notifications related to user
      NotificationModel.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
    ]);

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
