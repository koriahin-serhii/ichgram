import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from '../controllers/followController.js';

const router: Router = express.Router();

router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);

export default router;
