import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Get logged-in user
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.userId).populate('savedDeals');
  res.json(user);
});

// Save a deal
router.post('/save-deal/:offerId', verifyToken, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $addToSet: { savedDeals: req.params.offerId }
  });
  res.json({ success: true });
});

// Remove a deal
router.delete('/save-deal/:offerId', verifyToken, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $pull: { savedDeals: req.params.offerId }
  });
  res.json({ success: true });
});

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default router;