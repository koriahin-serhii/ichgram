import express, { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router: Router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Logout (can be called from any client, cookie will be removed)
router.post('/logout', logout);

export default router;
