import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addComment, getComments } from '../controllers/commentController.js';

const router: Router = express.Router();

router.post('/comment', authMiddleware, addComment);
router.get('/comments/:postId', getComments);

export default router;
