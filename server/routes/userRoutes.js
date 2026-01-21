import express from "express";
import { getPublicUserProfile, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id').get(protect, getPublicUserProfile);

export default router;

