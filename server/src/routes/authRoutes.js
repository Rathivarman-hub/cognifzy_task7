import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import { register, login, getProfile, oauthCallback } from '../controllers/authController.js';
import { protect, generateToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import User from '../models/userModel.js';

const router = express.Router();

// ── Passport Local Strategy ──
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email, provider: 'local' }).select('+password');
    if (!user || !(await user.comparePassword(password))) return done(null, false);
    done(null, user);
  } catch (err) { done(err); }
}));

// ── Passport Google Strategy ──
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ provider: 'google', providerId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.provider = 'google';
          user.providerId = profile.id;
          user.avatar = profile.photos[0]?.value;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
            provider: 'google',
            providerId: profile.id,
          });
        }
      }
      done(null, user);
    } catch (err) { done(err); }
  }));
}

// ── Passport GitHub Strategy ──
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id') {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
      let user = await User.findOne({ provider: 'github', providerId: profile.id });
      if (!user) {
        user = await User.findOne({ email });
        if (user) {
          user.provider = 'github';
          user.providerId = String(profile.id);
          user.avatar = profile.photos[0]?.value;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
            avatar: profile.photos[0]?.value,
            provider: 'github',
            providerId: String(profile.id),
          });
        }
      }
      done(null, user);
    } catch (err) { done(err); }
  }));
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findById(id)); } catch (e) { done(e); }
});

// ── Routes ──
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', protect, getProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
);

export default router;
