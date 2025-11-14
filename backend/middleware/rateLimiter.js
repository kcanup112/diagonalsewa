const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// In-memory store for tracking booking attempts per IP/phone
const bookingAttempts = new Map();
const phoneAttempts = new Map();

// Clean up old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  // Clean IP attempts
  for (const [ip, data] of bookingAttempts.entries()) {
    if (data.firstAttempt < oneHourAgo) {
      bookingAttempts.delete(ip);
    }
  }
  
  // Clean phone attempts
  for (const [phone, data] of phoneAttempts.entries()) {
    if (data.firstAttempt < oneHourAgo) {
      phoneAttempts.delete(phone);
    }
  }
}, 60 * 60 * 1000); // Run every hour

// General API rate limiter
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Very high limit
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiter for booking endpoint
const bookingRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased for testing - allows comprehensive validation
  skipSuccessfulRequests: false,
  skipFailedRequests: true, // Don't count failed requests
  message: {
    success: false,
    message: 'Too many booking requests from this IP. Please wait before making another booking.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Speed limiter - slows down requests after threshold
const bookingSpeedLimit = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // Increased from 2 to 10 for better mobile support
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  validate: { delayMs: false } // Disable delayMs validation warning
});

// Advanced booking validation middleware
const advancedBookingLimiter = (req, res, next) => {
  // Get real IP, handling proxies and mobile networks
  let clientIP = req.ip || req.connection.remoteAddress;
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    clientIP = forwarded.split(',')[0].trim();
  }
  
  // For mobile devices, create unique key with user agent hash
  const userAgent = req.get('User-Agent') || '';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('Android')) {
    const uaHash = userAgent.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    clientIP = `${clientIP}-mobile-${Math.abs(uaHash) % 10000}`;
  }
  
  const phone = req.body.phone;
  const now = Date.now();
  
  // Check IP-based limiting - very lenient for mobile (increased for testing)
  if (bookingAttempts.has(clientIP)) {
    const ipData = bookingAttempts.get(clientIP);
    
    // If more than 100 attempts in last hour (very lenient for testing)
    if (ipData.count >= 100 && (now - ipData.firstAttempt) < 60 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: 'Too many booking attempts. Please wait 1 hour before trying again.',
        retryAfter: new Date(ipData.firstAttempt + 60 * 60 * 1000).toISOString()
      });
    }
    
    // Reset counter if more than 1 hour has passed
    if ((now - ipData.firstAttempt) >= 60 * 60 * 1000) {
      bookingAttempts.set(clientIP, { count: 1, firstAttempt: now });
    } else {
      ipData.count++;
    }
  } else {
    bookingAttempts.set(clientIP, { count: 1, firstAttempt: now });
  }
  
  // Check phone-based limiting - very lenient (increased for testing)
  if (phone) {
    if (phoneAttempts.has(phone)) {
      const phoneData = phoneAttempts.get(phone);
      
      // If more than 50 attempts with same phone in last 24 hours (very lenient for testing)
      if (phoneData.count >= 50 && (now - phoneData.firstAttempt) < 24 * 60 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          message: 'This phone number has been used for multiple bookings. Please contact us directly.',
          retryAfter: new Date(phoneData.firstAttempt + 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      // Reset counter if more than 24 hours has passed
      if ((now - phoneData.firstAttempt) >= 24 * 60 * 60 * 1000) {
        phoneAttempts.set(phone, { count: 1, firstAttempt: now });
      } else {
        phoneData.count++;
      }
    } else {
      phoneAttempts.set(phone, { count: 1, firstAttempt: now });
    }
  }
  
  next();
};

// Honeypot validation - check for hidden fields that bots might fill
const honeypotValidation = (req, res, next) => {
  // Check for common bot fields
  const botFields = ['website', 'url', 'homepage', 'bot_field', 'spam_check'];
  
  for (const field of botFields) {
    if (req.body[field] && req.body[field].trim() !== '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request detected.',
      });
    }
  }
  
  next();
};

// Timing attack protection - add random delay
const timingProtection = (req, res, next) => {
  // Add random delay between 100-500ms to prevent timing attacks
  const delay = Math.floor(Math.random() * 400) + 100;
  setTimeout(() => next(), delay);
};

module.exports = {
  generalRateLimit,
  bookingRateLimit,
  bookingSpeedLimit,
  advancedBookingLimiter,
  honeypotValidation,
  timingProtection
};
