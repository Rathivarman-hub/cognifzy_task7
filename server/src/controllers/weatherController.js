import axios from 'axios';
import { AppError } from '../middleware/errorHandler.js';

const OW_BASE = 'https://api.openweathermap.org/data/2.5';

const incrementUsage = async (user) => {
  if (user) {
    user.apiUsage.weather += 1;
    user.apiUsage.total += 1;
    await user.save();
  }
};

// GET /api/weather/:city
export const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweather_api_key') {
      throw new AppError('OpenWeatherMap API key not configured', 503);
    }

    const { data } = await axios.get(`${OW_BASE}/weather`, {
      params: { q: city, appid: apiKey, units: 'metric' }
    });

    await incrementUsage(req.user);
    res.json({ success: true, data });
  } catch (err) {
    if (err.response?.status === 404) return next(new AppError('City not found', 404));
    if (err.response?.status === 401) return next(new AppError('Invalid OpenWeatherMap API key', 401));
    next(err);
  }
};

// GET /api/weather/coords/:lat/:lon
export const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweather_api_key') {
      throw new AppError('OpenWeatherMap API key not configured', 503);
    }

    const { data } = await axios.get(`${OW_BASE}/weather`, {
      params: { lat, lon, appid: apiKey, units: 'metric' }
    });

    await incrementUsage(req.user);
    res.json({ success: true, data });
  } catch (err) {
    if (err.response?.status === 401) return next(new AppError('Invalid OpenWeatherMap API key', 401));
    next(err);
  }
};
