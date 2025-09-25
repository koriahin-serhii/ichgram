import { Request, Response } from 'express';
import PostModel from '../models/postModel.js';
import { Types } from 'mongoose';

import { uploadPostImageToS3, deletePostImageFromS3 } from '../utils/s3.js';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
  file?: Express.Multer.File;
}

// Get posts by user ID
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const posts = await PostModel.find({ author: userId }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all posts (feed)
export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create post
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { description } = req.body;
    const author = req.user;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Image is required' });

    const imageUrl = await uploadPostImageToS3(
      file.buffer,
      file.mimetype,
      String(author)
    );
    const post = new PostModel({ description, imageUrl, author });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete post
export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user;
    if (post.author.toString() !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Delete image from S3
    if (post.imageUrl) {
      try {
        await deletePostImageFromS3(post.imageUrl);
      } catch (err) {
        console.warn('Failed to delete image from S3:', err);
      }
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update post
export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { description } = req.body;
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user;
    if (post.author.toString() !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (description) post.description = description;
    const file = req.file;
    if (file) {
      // Delete old image from S3
      if (post.imageUrl) {
        try {
          await deletePostImageFromS3(post.imageUrl);
        } catch (err) {
          // Not critical if failed to delete old file
          console.warn('Failed to delete old image from S3:', err);
        }
      }
      // Upload new image
      post.imageUrl = await uploadPostImageToS3(
        file.buffer,
        file.mimetype,
        String(userId)
      );
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
