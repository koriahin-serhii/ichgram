import { Request, Response } from 'express';
import User from '../models/userModel.js';
import PostModel from '../models/postModel.js';

// Search users by name or username
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Query is required' });
    }
    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ name: regex }, { fullName: regex }],
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Explore: get posts in random order
export const explorePosts = async (_req: Request, res: Response) => {
  try {
    const posts = await PostModel.aggregate([{ $sample: { size: 20 } }]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
