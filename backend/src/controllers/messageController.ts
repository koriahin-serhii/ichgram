import { Request, Response } from 'express';
import MessageModel from '../models/messageModel.js';
import { Types } from 'mongoose';
import { getSocketIO } from '../utils/socketInstance.js';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
}

// Get list of conversations (users with whom current user has messages)
export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUserId = req.user;
    
    // Get all unique user IDs who have messages with current user
    const messages = await MessageModel.aggregate([
      {
        $match: {
          $or: [
            { sender: new Types.ObjectId(String(currentUserId)) },
            { recipient: new Types.ObjectId(String(currentUserId)) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new Types.ObjectId(String(currentUserId))] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $first: '$text' },
          lastMessageDate: { $first: '$createdAt' },
          lastMessageSender: { $first: '$sender' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          profileImage: '$user.profileImage',
          lastMessage: 1,
          lastMessageDate: 1,
          lastMessageSender: 1,
        },
      },
      {
        $sort: { lastMessageDate: -1 },
      },
    ]);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get message history between two users
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;
    const messages = await MessageModel.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    })
      .populate('sender', '_id name fullName profileImage')
      .populate('recipient', '_id name fullName profileImage')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Send a message
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { text } = req.body;
    const sender = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const message = new MessageModel({
      sender,
      recipient: userId,
      text: text.trim(),
    });

    await message.save();
    await message.populate('sender', '_id name fullName profileImage');
    await message.populate('recipient', '_id name fullName profileImage');

    // Send message via socket to recipient and sender
    const io = getSocketIO();
    if (io) {
      // Send to recipient
      io.to(userId).emit('receiveMessage', message);
      // Also send to sender (for multi-device support)
      io.to(String(sender)).emit('receiveMessage', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete all messages with a specific user
export const deleteConversation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    // Delete all messages between current user and the specified user
    await MessageModel.deleteMany({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    });

    // Notify both users via socket about conversation deletion
    const io = getSocketIO();
    if (io) {
      // Notify the other user
      io.to(userId).emit('conversationDeleted', {
        deletedBy: String(currentUserId),
        userId: String(currentUserId),
      });
      // Notify current user (for multi-device support)
      io.to(String(currentUserId)).emit('conversationDeleted', {
        deletedBy: String(currentUserId),
        userId: userId,
      });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
