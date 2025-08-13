const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const bookingRoutes = require('./routes/booking');
const calculatorRoutes = require('./routes/calculator');
const adminRoutes = require('./routes/admin');
const offersRoutes = require('./routes/offers');
const galleryRoutes = require('./routes/gallery');
const portfolioRoutes = require('./routes/portfolios');

// Import new utilities
const logger = require('./utils/logger');
const { generalLimiter, speedLimiter } = require('./utils/rateLimiting');
const { AppError } = require('./utils/errors');
const { healthCheck } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for proper IP detection
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Enhanced logging with custom format
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
}));

// Rate limiting and speed limiting
app.use(generalLimiter);
app.use(speedLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Static files for frontend images
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Routes
app.use('/api/booking', bookingRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/team', require('./routes/team'));

// Health check endpoint with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await healthCheck(sequelize);
    
    res.json({ 
      status: 'OK', 
      message: 'Diagonal Construction API is running',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth.database,
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced global error handler
app.use((err, req, res, next) => {
  logger.error('Global error handler', err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      timestamp: new Date().toISOString()
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
      timestamp: new Date().toISOString()
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    logger.info('Starting Diagonal Construction API server...');
    
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Sync database models
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized');
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api/health`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Unable to start server', error);
    process.exit(1);
  }
};

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;
