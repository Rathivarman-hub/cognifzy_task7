import express from 'express';
import { getWeatherByCity, getWeatherByCoords } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/coords/:lat/:lon', protect, getWeatherByCoords);
router.get('/:city', protect, getWeatherByCity);

export default router;
