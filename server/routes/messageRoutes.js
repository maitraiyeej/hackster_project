import express from 'express';
import getTeamMessages from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.get('/:teamId', protect, getTeamMessages);

export default router;