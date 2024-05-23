import express from 'express';
import { createAd, matchRequests } from '../controllers/adController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createAd);
router.get('/match', authMiddleware, matchRequests);

export default router;
