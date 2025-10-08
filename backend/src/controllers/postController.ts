import { Request, Response } from 'express';
import PostModel from '../models/postModel.js';
import LikeModel from '../models/likeModel.js';
import CommentModel from '../models/commentModel.js';
import NotificationModel from '../models/notificationModel.js';
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
    const posts = await PostModel.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          imageUrl: 1,
          likesCount: 1,
          commentsCount: 1,
          createdAt: 1,
          updatedAt: 1,
          'author._id': 1,
          'author.name': 1,
          'author.profileImage': 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all posts (feed)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          imageUrl: 1,
          likesCount: 1,
          commentsCount: 1,
          createdAt: 1,
          updatedAt: 1,
          'author._id': 1,
          'author.name': 1,
          'author.profileImage': 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get total count for pagination metadata
    const totalPosts = await PostModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    const hasMore = page < totalPages;

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasMore,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const posts = await PostModel.aggregate([
      { $match: { _id: new Types.ObjectId(postId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          imageUrl: 1,
          likesCount: 1,
          commentsCount: 1,
          createdAt: 1,
          updatedAt: 1,
          'author._id': 1,
          'author.name': 1,
          'author.profileImage': 1,
        },
      },
    ]);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(posts[0]);
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
    
    // Populate author information and add counts (0 for new post)
    await post.populate('author', '_id name profileImage');
    
    const postWithCounts = {
      ...post.toObject(),
      likesCount: 0,
      commentsCount: 0,
    };
    
    res.status(201).json(postWithCounts);
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
    
    const postId = post._id;
    
    // Delete image from S3
    if (post.imageUrl) {
      try {
        await deletePostImageFromS3(post.imageUrl);
      } catch (err) {
        console.warn('Failed to delete image from S3:', err);
      }
    }
    
    // Delete all related data
    await Promise.all([
      // Delete the post itself
      post.deleteOne(),
      // Delete all likes for this post
      LikeModel.deleteMany({ post: postId }),
      // Delete all comments for this post
      CommentModel.deleteMany({ post: postId }),
      // Delete all notifications related to this post
      NotificationModel.deleteMany({ post: postId }),
    ]);
    
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
    
    // Populate author information before sending response
    await post.populate('author', '_id name profileImage');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
