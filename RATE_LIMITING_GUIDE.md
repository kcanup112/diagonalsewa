# Rate Limiting Implementation Guide

This document outlines the comprehensive rate limiting strategy implemented to protect the booking service from exploitation and server abuse.

## Overview

The rate limiting system uses multiple layers of protection:

1. **Backend Rate Limiting** - Server-side protection using express-rate-limit
2. **Frontend Rate Limiting** - Client-side validation using localStorage
3. **Advanced Protection Mechanisms** - Additional security measures

## Backend Protection (Server-side)

### 1. General API Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All API endpoints
- **Purpose**: Prevent general API abuse

### 2. Booking-Specific Rate Limiting
- **Limit**: 3 bookings per hour per IP
- **Scope**: `/api/booking` POST endpoint only
- **Purpose**: Prevent booking spam

### 3. Advanced Booking Limiter
- **IP-based**: Max 3 attempts per hour from same IP
- **Phone-based**: Max 2 bookings per 24 hours using same phone number
- **Storage**: In-memory with automatic cleanup
- **Purpose**: Prevent circumvention using different devices

### 4. Additional Security Measures

#### Honeypot Validation
Hidden form fields that legitimate users won't fill but bots might:
- `website` field
- `url` field  
- `bot_field` field

If any of these fields contain data, the request is rejected as a bot attempt.

#### Timing Attack Protection
- Random delay (100-500ms) added to each booking request
- Prevents timing-based analysis attacks
- Makes it harder to determine server processing patterns

#### Request Validation
- Phone number format validation (10 digits)
- Email format validation
- File type and size validation (images only, max 5MB each)
- Date validation (future dates only)
- Input sanitization and length limits

## Frontend Protection (Client-side)

### 1. Local Storage Rate Limiting
- Tracks booking attempts using browser localStorage
- **IP-equivalent**: 3 attempts per minute (using localStorage as proxy)
- **Phone-based**: 2 attempts per 24 hours per phone number
- **Purpose**: Immediate feedback without server round-trip

### 2. User Experience Features
- Attempt counter display
- Remaining time countdown
- Progressive warnings
- Form validation with real-time feedback

### 3. Offer Popup Protection
- **Limit**: 5 claims per 5 minutes
- **Purpose**: Prevent rapid-fire offer claiming
- **UX**: Button disabled with "Please Wait..." message

## Implementation Details

### Backend Middleware Stack (for booking route):
```javascript
router.post('/api/booking',
  bookingLimiter,             // 3 per hour (IP-based)
  timingProtection,           // Random delay (100-500ms)
  honeypotValidation,         // Bot detection
  advancedBookingLimiter,     // IP + Phone tracking
  upload.array('images', 5),  // File upload handling
  bookingValidation,          // Input validation
  async (req, res) => { ... }
);
```

### Frontend Hook Usage:
```javascript
const {
  attempts,           // Current attempt count
  isLimited,         // Whether currently rate limited
  checkRateLimit,    // Check if action is allowed
  recordAttempt,     // Record an attempt
  checkPhoneLimit    // Check phone-specific limits
} = useRateLimit(3, 60000); // 3 attempts per minute
```

## Rate Limit Responses

### Backend Error Responses:
```json
{
  "success": false,
  "message": "Too many booking attempts from your location. Please wait 1 hour before trying again.",
  "retryAfter": "2025-08-09T15:30:00.000Z"
}
```

### Frontend User Messages:
- "Too many booking attempts. Please wait X seconds before trying again."
- "This phone number has been used for booking recently. Please wait 24 hours or contact us directly."
- "Booking attempts: 2/3. Please ensure all information is correct."

## Security Benefits

1. **DoS Protection**: Prevents overwhelming the server with requests
2. **Resource Conservation**: Limits expensive database operations
3. **Spam Prevention**: Reduces fake or duplicate bookings
4. **Bot Mitigation**: Honeypot fields catch automated submissions
5. **Fair Usage**: Ensures legitimate users can access the service
6. **Timing Attack Prevention**: Random delays obscure server processing patterns

## Monitoring and Maintenance

### Automatic Cleanup:
- Backend: In-memory stores cleared every hour
- Frontend: localStorage entries expire automatically

### Logging:
- All rate limit violations are logged with IP, timestamp, and request details
- Failed booking attempts are tracked for analysis

### Adjustable Parameters:
All rate limits are configurable and can be adjusted based on usage patterns:
- Time windows
- Request limits
- Error messages
- Cleanup intervals

## Circumvention Prevention

### Multiple Protection Layers:
1. IP-based limiting (handles same-device abuse)
2. Phone-based limiting (handles multi-device abuse)
3. Browser fingerprinting via localStorage (handles IP changes)
4. Bot detection via honeypots (handles automated tools)
5. Timing variations (prevents timing analysis)

### Common Bypass Methods Addressed:
- **VPN/Proxy hopping**: Phone number tracking prevents this
- **Different browsers**: localStorage is browser-specific but phone validation catches this
- **Automated tools**: Honeypot fields and timing protection mitigate this
- **Multiple devices**: Phone number validation prevents abuse

## Configuration

### Environment Variables:
```
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100        # General limit
BOOKING_RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
BOOKING_RATE_LIMIT_MAX=3           # Booking limit
```

### Customization Options:
- Adjust time windows based on business requirements
- Modify attempt limits for different user types
- Customize error messages for better UX
- Add whitelist for trusted IPs if needed

This multi-layered approach provides robust protection while maintaining a smooth user experience for legitimate customers.
