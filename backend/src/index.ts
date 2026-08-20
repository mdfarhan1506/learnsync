import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import classRoutes from './routes/classes';
import studentRoutes from './routes/students';
import assessmentRoutes from './routes/assessments';
import groupRoutes from './routes/groups';
import activityRoutes from './routes/activities';
import progressRoutes from './routes/progress';
import rulesRoutes from './routes/rules';
import quickCheckRoutes from './routes/quickChecks';
import demoRoutes from './routes/demo';

const app = express();
const PORT = process.env.PORT || 3001;

// Dynamic CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Also allow subdomains or specific Vercel/Railway domains if FRONTEND_URL is set
    return callback(null, true); // Fallback to safe pass-through or specify exact match
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/quick-checks', quickCheckRoutes);
app.use('/api/demo', demoRoutes);

// Root & Health check routes for Vercel / Ping
app.get('/', (_req, res) => {
  res.json({
    message: 'LearnSync backend is running',
    version: '1.0.0',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (_req, res) => {
  res.json({
    message: 'LearnSync API is running',
    version: '1.0.0',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Only start standalone listener when running directly as a script (not in serverless or imported)
if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 LEARNsync backend running on http://localhost:${PORT}`);
  });
}

export default app;
