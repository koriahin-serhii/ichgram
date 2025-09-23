import { Request, Response } from 'express';
import PostModel from '../models/postModel.js';
import { Types } from 'mongoose';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

    const bucketName = process.env.S3_BUCKET!;
    const key = Date.now() + '-' + file.originalname;

    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
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
        const oldUrl = post.imageUrl;
        const urlParts = oldUrl.split('/');
        const oldKey = urlParts.slice(3).join('/').replace(`${process.env.S3_BUCKET!}.s3.${process.env.AWS_REGION}.amazonaws.com/`, '');
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: oldKey,
        }));
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
          const oldUrl = post.imageUrl;
          const urlParts = oldUrl.split('/');
          const oldKey = urlParts.slice(3).join('/').replace(`${process.env.S3_BUCKET!}.s3.${process.env.AWS_REGION}.amazonaws.com/`, '');
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: oldKey,
          }));
        } catch (err) {
          // Not critical if failed to delete old file
          console.warn('Failed to delete old image from S3:', err);
        }
      }
      // Upload new image
      const bucketName = process.env.S3_BUCKET!;
      const key = Date.now() + '-' + file.originalname;
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));
      post.imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
