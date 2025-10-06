import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from '../controllers/notificationController.js';

const router: Router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/read/:notificationId', authMiddleware, markAsRead);
router.post('/read', authMiddleware, markAllAsRead);

export default router;
