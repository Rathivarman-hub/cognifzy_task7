import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Connect DB
connectDB();

const app = express();

// ── Security ──
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://pulseboard-1.vercel.app',
  credentials: true,
}));

// ── Session (for Passport OAuth) ──
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Parsers ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Rate Limiting ──
app.use('/api/', generalLimiter);

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CognifyZ API is running', timestamp: new Date().toISOString() });
});

// ── 404 & Error Handler ──
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

// Forced nodemon restart to load new .env variables (GitHub)
