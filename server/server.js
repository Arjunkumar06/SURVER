import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { connectDB } from './services/dbStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root or current directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root index status
app.get('/', (req, res) => {
  res.json({
    name: 'SURVER API Engine',
    description: 'Satellite-Powered AI Emergency Resource Orchestration Network',
    status: 'OPERATIONAL',
    endpoints: {
      health: '/api/health',
      disasters: '/api/disasters',
      aiAnalysis: 'POST /api/ai/analyze-emergency',
      satellite: '/api/satellite/:zoneId',
      resources: '/api/resources',
      optimize: 'POST /api/resources/optimize',
      responsePlans: '/api/response-plans',
      analytics: '/api/analytics'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SURVER Unhandled Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server immediately and connect DB in background
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🛰️  SURVER Engine is live on http://localhost:${PORT}`);
  console.log(` 📡  Status: Operational`);
  console.log(` 🤖  Gemini AI API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Resilient Fallback Mode Active'}`);
  console.log(`=======================================================`);

  // Attempt database connection in background
  if (process.env.MONGODB_URI) {
    connectDB(process.env.MONGODB_URI).catch((err) => {
      console.log('[SURVER DB] Background MongoDB connect note:', err.message);
    });
  }
});
