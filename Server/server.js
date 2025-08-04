import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/index.js';
import { initializeDatabase } from './db/init.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import transactionsRoutes from './routes/transactions.js';
import userRoutes from './routes/userRoutes.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// Cron jobs
import { startLowStockAlert } from './cron/lowStockAlert.js';

import qrRoutes from './routes/qrRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', componentRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api', userRoutes);


app.use('/api/qr', qrRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/metrics', metricsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database test
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0] });
  } catch (err) {
    console.error('❌ Database error:', err.message);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    
    // Start cron jobs
    if (process.env.ENABLE_CRON === 'true') {
      startLowStockAlert();
      console.log('📅 Cron jobs started');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Database test: http://localhost:${PORT}/api/test-db`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();