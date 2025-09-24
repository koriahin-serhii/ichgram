import { Request, Response } from 'express';
import FollowModel from '../models/followModel.js';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: string | Types.ObjectId;
}

// Get followers of a user
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const followers = await FollowModel.find({ following: userId }).populate(
      'follower',
      'name'
    );
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get following of a user
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const following = await FollowModel.find({ follower: userId }).populate(
      'following',
      'name'
    );
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Follow a user
export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const follower = req.user;
    const { userId } = req.body;
    if (String(follower) === String(userId)) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    const exists = await FollowModel.findOne({ follower, following: userId });
    if (exists) {
      return res.status(400).json({ message: 'Already following' });
    }
    await FollowModel.create({ follower, following: userId });
    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Unfollow a user
export const unfollowUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const follower = req.user;
    const { userId } = req.body;
    const follow = await FollowModel.findOne({ follower, following: userId });
    if (!follow) {
      return res.status(400).json({ message: 'Not following' });
    }
    await follow.deleteOne();
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
