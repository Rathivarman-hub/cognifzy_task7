import axios from 'axios';
import { AppError } from '../middleware/errorHandler.js';

const NEWS_BASE = 'https://newsapi.org/v2';
const PAGE_SIZE = 9;

const VALID_CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

const incrementUsage = async (user) => {
  if (user) {
    user.apiUsage.news += 1;
    user.apiUsage.total += 1;
    await user.save();
  }
};

// GET /api/news/:category
export const getNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey || apiKey === 'your_news_api_key') {
      throw new AppError('NewsAPI key not configured', 503);
    }

    const cat = VALID_CATEGORIES.includes(category) ? category : 'general';

    const { data } = await axios.get(`${NEWS_BASE}/top-headlines`, {
      params: { category: cat, language: 'en', pageSize: PAGE_SIZE, page, apiKey }
    });

    await incrementUsage(req.user);

    const articles = data.articles.filter(a => a.title && a.title !== '[Removed]');
    res.json({ success: true, data: { articles, totalResults: data.totalResults, page, category: cat } });
  } catch (err) {
    if (err.response?.status === 401) return next(new AppError('Invalid NewsAPI key', 401));
    next(err);
  }
};

// GET /api/news/search/:query
export const searchNews = async (req, res, next) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey || apiKey === 'your_news_api_key') {
      throw new AppError('NewsAPI key not configured', 503);
    }

    if (!query || query.trim().length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    const { data } = await axios.get(`${NEWS_BASE}/everything`, {
      params: { q: query, language: 'en', pageSize: PAGE_SIZE, page, sortBy: 'publishedAt', apiKey }
    });

    await incrementUsage(req.user);

    const articles = data.articles.filter(a => a.title && a.title !== '[Removed]');
    res.json({ success: true, data: { articles, totalResults: data.totalResults, page, query } });
  } catch (err) {
    if (err.response?.status === 401) return next(new AppError('Invalid NewsAPI key', 401));
    next(err);
  }
};
