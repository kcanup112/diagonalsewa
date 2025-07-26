/**
 * Rate Limiting Middleware for API Protection
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const logger = require('./logger');
const { RateLimitError } = require('./errors');

/**
 * Custom rate limit handler
 */
const rateLimitHandler = (req, res, next, options) => {
  logger.warn('Rate limit exceeded', {
    ip: req.ip,
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent')
  });

  throw new RateLimitError('Too many requests, please try again later');
};

/**
 * General API rate limiting
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler
});

/**
 * Strict rate limiting for sensitive operations
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes',
    errorCode: 'STRICT_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler
});

/**
 * Calculation rate limiting (to prevent abuse of expensive operations)
 */
const calculationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 calculations per minute
  message: {
    success: false,
    message: 'Too many calculations, please wait a minute before trying again',
    errorCode: 'CALCULATION_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler
});

/**
 * Booking rate limiting
 */
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 bookings per hour
  message: {
    success: false,
    message: 'Too many booking attempts, please wait an hour before trying again',
    errorCode: 'BOOKING_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler
});

/**
 * Speed limiting for additional protection
 */
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  onLimitReached: (req, res, options) => {
    logger.warn('Speed limit reached', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
  }
});

/**
 * Custom rate limiter factory
 */
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
  };

  return rateLimit({ ...defaultOptions, ...options });
};

module.exports = {
  generalLimiter,
  strictLimiter,
  calculationLimiter,
  bookingLimiter,
  speedLimiter,
  createRateLimiter
};
