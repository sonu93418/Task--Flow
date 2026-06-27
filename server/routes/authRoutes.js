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
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  requireStrategy('google', 'Google'),
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
  }),
  oauthCallback
);

// ─── GitHub OAuth ───
router.get('/github',
  requireStrategy('github', 'GitHub'),
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  requireStrategy('github', 'GitHub'),
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=github_auth_failed`
  }),
  oauthCallback
);

export default router;
