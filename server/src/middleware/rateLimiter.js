import rateLimit from 'express-rate-limit';

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(windowMs / 1000 / 60) + ' minutes',
      });
    },
  });

// General API: 100 requests per 15 min
export const generalLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests. You have exceeded the 100 requests per 15 minutes limit.'
);

// Auth routes: 10 requests per 15 min (stricter)
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts. Please try again in 15 minutes.'
);
