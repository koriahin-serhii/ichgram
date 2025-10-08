import { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendPasswordResetEmail } from '../utils/emailService.js';

dotenv.config();

const jwtKey: string = process.env.JWT_SECRET as string;

// Registration
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, fullName } = req.body;
    
    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Check if username exists
    const usernameExists = await User.findOne({ name });
    if (usernameExists) {
      return res.status(400).json({ message: 'User with this username already exists' });
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

// Get current user (protected route)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, jwtKey) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Reset Password - sends temporary password to email
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: 'If this email exists, a password reset email has been sent' 
      });
    }
    
    // Generate temporary password (8 characters)
    const tempPassword = crypto.randomBytes(4).toString('hex');
    
    // Update user password (will be hashed by pre-save hook)
    user.password = tempPassword;
    await user.save();
    
    // Send email with temporary password
    try {
      await sendPasswordResetEmail(email, tempPassword);
      console.log(`Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Revert password change if email fails
      return res.status(500).json({ 
        message: 'Failed to send reset email. Please try again later.' 
      });
    }
    
    res.status(200).json({ 
      message: 'Password reset email has been sent. Please check your inbox.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
