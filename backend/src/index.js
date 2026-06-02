require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Proxy trust for rate limiting and reverse proxies
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Documentation
app.use(`/api/${API_VERSION}/docs`, swaggerUi.serve);
app.get(`/api/${API_VERSION}/docs`, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: `/api/${API_VERSION}/api-spec`,
  },
}));

// API specification endpoint
app.get(`/api/${API_VERSION}/api-spec`, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/tasks`, taskRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Prime AI Backend API',
    version: `${API_VERSION}`,
    documentation: `/api/${API_VERSION}/docs`,
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      tasks: `/api/${API_VERSION}/tasks`,
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    code: 'NOT_FOUND',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start application only after database connection succeeds
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api/${API_VERSION}/docs`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Server startup aborted due to database connection failure.');
    process.exit(1);
  }
};

startServer();

module.exports = app;
