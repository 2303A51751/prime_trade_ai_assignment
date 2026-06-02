const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('No token provided in request');
    return res.status(401).json({
      success: false,
      message: 'No authentication token provided',
      code: 'NO_TOKEN',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    logger.error(`JWT verification failed: ${error.message}`);
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
    const message =
      error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid authentication token';

    return res.status(statusCode).json({
      success: false,
      message,
      code: error.name,
    });
  }
};

module.exports = authMiddleware;
