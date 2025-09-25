import { Request, Response } from 'express';
import NotificationModel from '../models/notificationModel.js';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
}

// Get notifications for the authenticated user
export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user;
    const notifications = await NotificationModel.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('post', 'description')
      .populate('comment', 'text');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user;
    await NotificationModel.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
