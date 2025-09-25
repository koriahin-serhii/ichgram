import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getMessages } from '../controllers/messageController.js';

const router: Router = express.Router();

// Get message history between two users
router.get('/:userId', authMiddleware, getMessages);

export default router;
