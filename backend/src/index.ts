import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import prisma from './lib/prisma';
import { seedDatabase } from './seed/seed';

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
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Helmet with CSP adjusted for API and static serving
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Dynamic CORS configuration
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, same-origin)
      if (!origin) return callback(null, true);

      // In non-production or wildcard, allow all
      if (process.env.NODE_ENV !== 'production' || configuredOrigins.includes('*')) {
        return callback(null, true);
      }

      // Allow configured origins, localhosts, and Render / Vercel domains
      if (
        configuredOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      // Default to allowed in permissive web mode
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate limiting (generous limits for classroom/demo usage)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing & logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
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

// Health check routes for Render, Ping, and monitoring
app.get(['/health', '/api/health'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'learnsync-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (_req, res) => {
  res.status(200).json({
    message: 'LEARNsync API is running',
    version: '1.0.0',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static assets if built (Monorepo unified service support)
const possibleFrontendDistPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), 'dist/frontend'),
];

const frontendDistPath = possibleFrontendDistPaths.find((p) => fs.existsSync(p));

if (frontendDistPath) {
  console.log(`📦 Serving static frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // SPA client-side routing fallback (for non-API GET requests)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // If backend is deployed standalone without frontend build
  app.get('/', (_req, res) => {
    res.status(200).json({
      message: 'LEARNsync backend is running',
      version: '1.0.0',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });
}

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Auto-seed on startup if database is empty
async function ensureDatabaseReady() {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 No users found in database. Running initial seed...');
      await seedDatabase();
      console.log('✅ Initial database seed completed successfully.');
    }
  } catch (error: any) {
    console.warn('⚠️ Database auto-seed check skipped or encountered note:', error.message);
  }
}

// Start standalone listener on 0.0.0.0 for Render & container compatibility
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 LEARNsync backend running on http://0.0.0.0:${PORT}`);
    await ensureDatabaseReady();
  });
}

export default app;
