import express from 'express';
import { getNewsByCategory, searchNews } from '../controllers/newsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search/:query', protect, searchNews);
router.get('/:category', protect, getNewsByCategory);

export default router;
