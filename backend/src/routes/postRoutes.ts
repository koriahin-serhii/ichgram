import express, { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getUserPosts,
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost
} from '../controllers/postController.js';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all posts of a user
router.get('/user/:userId', getUserPosts);
// Get all posts (feed)
router.get('/', getAllPosts);
// Get post by ID
router.get('/:id', getPostById);
// Create post (requires authentication and file)
router.post('/', authMiddleware, upload.single('image'), createPost);
// Delete post (requires authentication)
router.delete('/:id', authMiddleware, deletePost);
// Update post (requires authentication and file)
router.put('/:id', authMiddleware, upload.single('image'), updatePost);

export default router;
