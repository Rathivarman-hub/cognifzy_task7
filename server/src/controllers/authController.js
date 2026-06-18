import User from '../models/userModel.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new AppError('Please provide name, email and password', 400);
    if (password.length < 6) throw new AppError('Password must be at least 6 characters', 400);

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already in use', 400);

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user: user.toPublic() });
  } catch (err) { next(err); }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Please provide email and password', 400);

    const user = await User.findOne({ email, provider: 'local' }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: user.toPublic() });
  } catch (err) { next(err); }
};

// GET /api/auth/profile
export const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user.toPublic() });
  } catch (err) { next(err); }
};

// OAuth callback handler
export const oauthCallback = (provider) => async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  } catch {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};
