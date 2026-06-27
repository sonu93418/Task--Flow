import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

/**
 * Find or create a user from an OAuth profile.
 * If a user with the same email exists (e.g. registered locally),
 * we link the OAuth provider to that existing account.
 */
async function findOrCreateOAuthUser(provider, profile) {
  const providerId = profile.id;
  const email = profile.emails?.[0]?.value?.toLowerCase();
  const name = profile.displayName || profile.username || email?.split('@')[0] || 'User';
  const avatar = profile.photos?.[0]?.value || null;

  // 1. Check if this exact OAuth account already exists
  let user = await User.findOne({ provider, providerId });
  if (user) {
    if (avatar && user.avatar !== avatar) {
      user.avatar = avatar;
      await user.save();
    }
    return user;
  }

  // 2. Check if a user with the same email exists (e.g. local signup)
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      user.provider = provider;
      user.providerId = providerId;
      if (avatar) user.avatar = avatar;
      await user.save();
      return user;
    }
  }

  // 3. Create a brand-new user
  user = await User.create({
    name,
    email: email || `${provider}_${providerId}@taskflow.local`,
    provider,
    providerId,
    avatar
  });

  return user;
}

export default function configurePassport() {
  // ─── Serialization ───
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // ─── Google OAuth 2.0 Strategy ───
  // Always register if env vars exist (even if wrong — Google will show the error)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    }, async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser('google', profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }));
    console.log('✅ Google OAuth strategy registered');
  } else {
    console.log('⚠️  Google OAuth: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in .env');
  }

  // ─── GitHub OAuth 2.0 Strategy ───
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email']
    }, async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser('github', profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }));
    console.log('✅ GitHub OAuth strategy registered');
  } else {
    console.log('⚠️  GitHub OAuth: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing in .env');
  }

  return passport;
}
