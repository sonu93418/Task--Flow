import express from 'express';
import passport from 'passport';
import { register, login, getMe, oauthCallback } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

// ─── Local Auth ───────────────────────────────────────────────────────────────
router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.get('/me', auth, getMe);

// ─── Helper: guard against unconfigured OAuth strategies ─────────────────────
function requireStrategy(strategyName, providerLabel) {
  return (req, res, next) => {
    if (!passport._strategy(strategyName)) {
      return res.status(501).json({
        success: false,
        message: `${providerLabel} OAuth is not configured on this server.`
      });
    }
    next();
  };
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────
//
// We pass `action` (login | register) via the OAuth `state` parameter instead
// of express-session. This is stateless and survives Render's MemoryStore
// limitations and cold-starts perfectly.
//
router.get('/google',
  requireStrategy('google', 'Google'),
  (req, res, next) => {
    const action = req.query.action === 'register' ? 'register' : 'login';
    // Encode action as a base64 JSON blob in the state param
    const state = Buffer.from(JSON.stringify({ action })).toString('base64');
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
      session: false   // no session needed — state carries the payload
    })(req, res, next);
  }
);

router.get('/google/callback',
  requireStrategy('google', 'Google'),
  (req, res, next) => {
    // Decode the action back out of the state param before Passport runs
    try {
      const raw = req.query.state || '';
      const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
      req._oauthAction = decoded.action || 'login';
    } catch {
      req._oauthAction = 'login';
    }

    passport.authenticate('google', { session: false }, (err, user) => {
      if (err) {
        const msg = encodeURIComponent(err.message || 'Google authentication failed');
        if (err.message === 'Account not found. Please register first.') {
          return res.redirect(`${process.env.CLIENT_URL}/register?error=${msg}`);
        }
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${msg}`);
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  oauthCallback
);

// ─── GitHub OAuth ─────────────────────────────────────────────────────────────
router.get('/github',
  requireStrategy('github', 'GitHub'),
  (req, res, next) => {
    const action = req.query.action === 'register' ? 'register' : 'login';
    const state = Buffer.from(JSON.stringify({ action })).toString('base64');
    passport.authenticate('github', {
      scope: ['user:email'],
      state,
      session: false
    })(req, res, next);
  }
);

router.get('/github/callback',
  requireStrategy('github', 'GitHub'),
  (req, res, next) => {
    try {
      const raw = req.query.state || '';
      const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
      req._oauthAction = decoded.action || 'login';
    } catch {
      req._oauthAction = 'login';
    }

    passport.authenticate('github', { session: false }, (err, user) => {
      if (err) {
        const msg = encodeURIComponent(err.message || 'GitHub authentication failed');
        if (err.message === 'Account not found. Please register first.') {
          return res.redirect(`${process.env.CLIENT_URL}/register?error=${msg}`);
        }
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${msg}`);
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=github_auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  oauthCallback
);

export default router;
