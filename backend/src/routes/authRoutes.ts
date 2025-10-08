import express, { Router } from 'express';
import { register, login, logout, getCurrentUser, resetPassword } from '../controllers/authController.js';

const router: Router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Get current user (checks cookie)
router.get('/me', getCurrentUser);

// Logout (can be called from any client, cookie will be removed)
router.post('/logout', logout);

export default router;
