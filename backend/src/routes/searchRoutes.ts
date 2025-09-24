import express, { Router } from 'express';
import { searchUsers, explorePosts } from '../controllers/searchController.js';

const router: Router = express.Router();

router.get('/users', searchUsers);
router.get('/explore', explorePosts);

export default router;
