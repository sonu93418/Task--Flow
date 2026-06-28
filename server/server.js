import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Render's reverse proxy so req.protocol === 'https' and
// secure cookies are set correctly in production.
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or matching origins
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Session (required by Passport for the OAuth handshake only).
// secure: true is required on Render (HTTPS). sameSite: 'none' allows
// the cookie to survive the Google/GitHub cross-origin redirect.
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'taskflow-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,          // HTTPS only in prod, plain HTTP in dev
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000         // 10 min — enough for the full OAuth round-trip
  }
}));

// Passport initialization
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/boards/:boardId/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`🚀 TaskFlow server running on port ${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.error(`   Run this to fix: netstat -ano | findstr :${PORT}  then  Stop-Process -Id <PID> -Force`);
      process.exit(1);
    } else {
      throw err;
    }
  });
};

start();
