import { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtKey: string = process.env.JWT_SECRET as string;

// Registration
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, fullName } = req.body;
    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email or username already exists' });
    }
    // Create user (password will be hashed in pre-save hook)
    const user = new User({ name, email, password, fullName });
    await user.save();
    res.status(201).json({ message: 'User successfully registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Generate token
    const token = jwt.sign({ userId: user._id }, jwtKey, { expiresIn: '7d' });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          fullName: user.fullName,
          profileImage: user.profileImage,
        },
        message: 'Login successful',
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logout successful' });
};
