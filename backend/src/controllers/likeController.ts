import { Request, Response } from 'express';
import LikeModel from '../models/likeModel.js';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
}

// Toggle like (add or remove)
export const toggleLike = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;
    const { postId } = req.body;
    const existing = await LikeModel.findOne({ user: userId, post: postId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ liked: false });
    }
    await LikeModel.create({ user: userId, post: postId });
    res.json({ liked: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get likes for a post
export const getLikes = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const likes = await LikeModel.find({ post: postId });
    res.json({ count: likes.length, likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
