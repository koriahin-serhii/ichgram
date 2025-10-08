import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteConversation,
} from '../controllers/messageController.js';

const router: Router = express.Router();

// Get list of conversations
router.get('/', authMiddleware, getConversations);

// Get message history between two users
router.get('/:userId', authMiddleware, getMessages);

// Send a message
router.post('/:userId', authMiddleware, sendMessage);

// Delete conversation with a user
router.delete('/:userId', authMiddleware, deleteConversation);

export default router;
