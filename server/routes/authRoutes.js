import express from 'express';
import passport from 'passport';
import { register, login, getMe, oauthCallback } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

// ─── Local Auth ───
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, getMe);

// ─── Helper: check if a passport strategy is registered ───
function requireStrategy(strategyName, providerLabel) {
  return (req, res, next) => {
    if (!passport._strategy(strategyName)) {
      return res.status(501).json({
        success: false,
        message: `${providerLabel} OAuth is not configured. Set ${strategyName.toUpperCase()}_CLIENT_ID and ${strategyName.toUpperCase()}_CLIENT_SECRET in your .env file and restart the server.`
      });
    }
    next();
  };
}

// ─── Google OAuth ───
router.get('/google',
  requireStrategy('google', 'Google'),
  (req, res, next) => {
    const action = req.query.action === 'register' ? 'register' : 'login';
    req.session.authAction = action;
    req.session.save((err) => {
      if (err) return next(err);
      passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    });
  }
);

router.get('/google/callback',
  requireStrategy('google', 'Google'),
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err) {
        const errorMessage = encodeURIComponent(err.message || 'Google authentication failed');
        if (err.message === 'Account not found. Please register first.') {
          return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/register?error=${errorMessage}`);
        }
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=${errorMessage}`);
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  oauthCallback
);

// ─── GitHub OAuth ───
router.get('/github',
  requireStrategy('github', 'GitHub'),
  (req, res, next) => {
    const action = req.query.action === 'register' ? 'register' : 'login';
    req.session.authAction = action;
    req.session.save((err) => {
      if (err) return next(err);
      passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
    });
  }
);

router.get('/github/callback',
  requireStrategy('github', 'GitHub'),
  (req, res, next) => {
    passport.authenticate('github', { session: false }, (err, user) => {
      if (err) {
        const errorMessage = encodeURIComponent(err.message || 'GitHub authentication failed');
        if (err.message === 'Account not found. Please register first.') {
          return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/register?error=${errorMessage}`);
        }
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=${errorMessage}`);
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=github_auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  oauthCallback
);

export default router;
