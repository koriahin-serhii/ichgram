import express, { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router: Router = express.Router();

// Setting up multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get user profile by ID
router.get('/profile/:id', authMiddleware, getProfile);

// Update profile (requires authentication and file upload)
router.put('/profile', authMiddleware, upload.single('profileImage'), updateProfile);

export default router;
