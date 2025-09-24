import { Request, Response } from 'express';
import CommentModel from '../models/commentModel.js';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
}

// Add comment
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;
    const { postId, text } = req.body;
    const comment = await CommentModel.create({
      user: userId,
      post: postId,
      text,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get comments for a post
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ post: postId }).populate(
      'user',
      'name'
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
