import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { toggleLike, getLikes } from '../controllers/likeController.js';

const router: Router = express.Router();

router.post('/like', authMiddleware, toggleLike);
router.get('/likes/:postId', getLikes);

export default router;
