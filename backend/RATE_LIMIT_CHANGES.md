# Rate Limiting Configuration Changes

## Issue
Rate limiting was too strict, blocking legitimate requests especially from iOS devices and mobile networks.

## Changes Made

### 1. Increased Rate Limits (More Lenient)

| Limiter | Before | After | Reason |
|---------|--------|-------|--------|
| General API | 100 req/15min | **500 req/15min** | Better mobile support |
| Strict Operations | 5 req/15min | **20 req/15min** | Reduce false positives |
| Calculator | 10 req/1min | **30 req/1min** | Allow multiple calculations |
| Booking | 3 bookings/hour | **10 bookings/hour** | Support legitimate users |
| IP-based booking | 3 attempts/hour | **10 attempts/hour** | Mobile IP changes |
| Phone-based booking | 2 attempts/24h | **5 attempts/24h** | Multiple inquiries |
| Speed limiter delay | After 2 requests | **After 10 requests** | Less aggressive |

### 2. Improved IP Detection for Mobile Devices

**Added X-Forwarded-For header support:**
```javascript
keyGenerator: (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip;
}
```

This properly handles:
- iOS devices behind carrier NAT
- Mobile network proxies
- Load balancers
- CDN requests
- Corporate firewalls

### 3. Smart Request Counting

**Added `skipFailedRequests` option:**
- Calculator: Don't count failed requests (validation errors, etc.)
- Booking: Don't count failed attempts (invalid data, etc.)

This prevents users from hitting rate limits due to client-side bugs or validation errors.

### 4. Proxy Trust Configuration

Updated `server.js`:
```javascript
app.set('trust proxy', true);
```

This ensures proper IP detection when requests come through:
- Mobile carrier proxies
- iOS network optimization
- Load balancers
- Reverse proxies

### 5. Development Mode

Rate limiting automatically disabled for localhost in development:
```javascript
const skipRateLimitForLocalhost = (req) => {
  const isLocalhost = req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  return isLocalhost && isDevelopment;
};
```

## Benefits

✅ **Better mobile support** - iOS and Android devices work smoothly
✅ **Reduced false positives** - Legitimate users not blocked
✅ **Smarter counting** - Only count successful requests
✅ **Proper IP detection** - Works with mobile networks and proxies
✅ **Development friendly** - No rate limiting on localhost
✅ **Still secure** - High enough limits to prevent abuse

## Testing

To test from iOS device:
1. Open Safari/Chrome on iPhone
2. Navigate to booking form
3. Try multiple bookings (should work up to 10/hour)
4. Check that calculator allows 30 calculations/minute

## Monitoring

Check logs for rate limit warnings:
```bash
grep "Rate limit exceeded" logs/*.log
```

Monitor if adjustments needed based on real user patterns.

## Future Improvements

Consider implementing:
- [ ] Per-user authentication-based rate limits (higher for logged-in users)
- [ ] Geographic-based rate limiting
- [ ] Dynamic rate limits based on server load
- [ ] Redis-based distributed rate limiting for multi-server deployments
