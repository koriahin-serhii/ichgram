import express from 'express';
import { getChatResponse } from '../controllers/aiController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/ai/chat - Get AI response
router.post('/chat', authMiddleware, getChatResponse);

export default router;
