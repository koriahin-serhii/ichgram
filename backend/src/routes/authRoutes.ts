import express, { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router: Router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

export default router;
