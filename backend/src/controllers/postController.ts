import { Request, Response } from 'express';
import PostModel from '../models/postModel.js';
import { Types } from 'mongoose';

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
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64'
    )}`;
    const post = new PostModel({ description, image: base64Image, author });
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
      post.image = `data:${file.mimetype};base64,${file.buffer.toString(
        'base64'
      )}`;
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
