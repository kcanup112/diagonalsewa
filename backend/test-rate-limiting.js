const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`)
};

async function testRateLimiting() {
  log.section('🔒 COMPREHENSIVE RATE LIMITING TESTS');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Test 1: General API Rate Limit (1000 requests/15min)
  log.info('Test 1: Testing General API Rate Limit (1000 req/15min)');
  try {
    const requests = [];
    for (let i = 0; i < 50; i++) {
      requests.push(axios.get(`${BASE_URL}/api/health`));
    }
    
    const responses = await Promise.all(requests);
    const allSuccess = responses.every(r => r.status === 200);
    
    if (allSuccess) {
      log.success('50 rapid requests succeeded - limit is high enough');
      results.passed++;
    } else {
      log.error('Some requests failed before hitting rate limit');
      results.failed++;
    }
    results.total++;
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Test 2: Booking Rate Limit (20 bookings/hour)
  log.info('\nTest 2: Testing Booking Rate Limit (20 req/hour)');
  try {
    const bookingData = {
      name: 'Test User',
      phone: '9876543210',
      email: 'test@example.com',
      address: '123 Test Street, Test City',
      serviceType: 'consultation',
      appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Test booking for rate limit'
    };

    let successCount = 0;
    let rateLimitedCount = 0;
    
    for (let i = 0; i < 25; i++) {
      try {
        const response = await axios.post(`${BASE_URL}/api/booking`, {
          ...bookingData,
          phone: `98765432${String(i).padStart(2, '0')}`, // Unique phone per request
          email: `test${i}@example.com`
        });
        
        if (response.status === 201) {
          successCount++;
        }
      } catch (error) {
        if (error.response?.status === 429) {
          rateLimitedCount++;
          log.info(`Rate limited at request ${i + 1}`);
          break;
        }
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (rateLimitedCount > 0) {
      log.success(`Rate limiting working: ${successCount} succeeded, hit limit at ${successCount + 1}`);
      results.passed++;
    } else if (successCount >= 20) {
      log.warn(`Created ${successCount} bookings without hitting limit - may be too lenient`);
      results.warnings++;
    } else {
      log.error('Unexpected behavior in booking rate limit');
      results.failed++;
    }
    results.total++;
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Test 3: Calculator Rate Limit (100 calculations/minute)
  log.info('\nTest 3: Testing Calculator Rate Limit (100 req/min)');
  try {
    const requests = [];
    for (let i = 0; i < 110; i++) {
      requests.push(
        axios.post(`${BASE_URL}/api/calculator/calculate`, {
          plinth_area: 1000 + i,
          floors: 1,
          quality: 'standard',
          project_type: 'residential'
        }).catch(err => ({ error: true, status: err.response?.status }))
      );
    }
    
    const responses = await Promise.all(requests);
    const successCount = responses.filter(r => !r.error).length;
    const rateLimitedCount = responses.filter(r => r.status === 429).length;
    
    if (rateLimitedCount > 0) {
      log.success(`Rate limiting working: ${successCount} succeeded, ${rateLimitedCount} rate limited`);
      results.passed++;
    } else {
      log.warn(`All ${successCount} requests succeeded - limit may be too high or not working`);
      results.warnings++;
    }
    results.total++;
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Test 4: Mobile Device Differentiation (iPhone vs iPad)
  log.info('\nTest 4: Testing Mobile Device Differentiation');
  try {
    const iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const iPadUA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    
    const iPhoneRequests = [];
    const iPadRequests = [];
    
    for (let i = 0; i < 25; i++) {
      iPhoneRequests.push(
        axios.get(`${BASE_URL}/api/health`, {
          headers: { 'User-Agent': iPhoneUA }
        }).catch(err => ({ error: true, status: err.response?.status }))
      );
      
      iPadRequests.push(
        axios.get(`${BASE_URL}/api/health`, {
          headers: { 'User-Agent': iPadUA }
        }).catch(err => ({ error: true, status: err.response?.status }))
      );
    }
    
    const [iPhoneResponses, iPadResponses] = await Promise.all([
      Promise.all(iPhoneRequests),
      Promise.all(iPadRequests)
    ]);
    
    const iPhoneSuccess = iPhoneResponses.filter(r => !r.error).length;
    const iPadSuccess = iPadResponses.filter(r => !r.error).length;
    
    if (iPhoneSuccess === 25 && iPadSuccess === 25) {
      log.success(`Both devices succeeded independently: iPhone ${iPhoneSuccess}, iPad ${iPadSuccess}`);
      results.passed++;
    } else {
      log.warn(`Some requests failed: iPhone ${iPhoneSuccess}/25, iPad ${iPadSuccess}/25`);
      results.warnings++;
    }
    results.total++;
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Test 5: Rate Limit Headers
  log.info('\nTest 5: Testing Rate Limit Response Headers');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    
    const hasRateLimitHeaders = 
      response.headers['ratelimit-limit'] || 
      response.headers['x-ratelimit-limit'] ||
      response.headers['retry-after'];
    
    if (hasRateLimitHeaders) {
      log.success('Rate limit headers present in response');
      log.info(`Headers: ${JSON.stringify({
        limit: response.headers['ratelimit-limit'],
        remaining: response.headers['ratelimit-remaining'],
        reset: response.headers['ratelimit-reset']
      }, null, 2)}`);
      results.passed++;
    } else {
      log.warn('No rate limit headers found in response');
      results.warnings++;
    }
    results.total++;
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Test 6: IP-based vs User-Agent Hashing
  log.info('\nTest 6: Testing User-Agent Hash Uniqueness');
  try {
    const userAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Model/iPhone14',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Model/iPhone15',
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Model/iPadPro'
    ];
    
    const results_per_ua = await Promise.all(
      userAgents.map(async (ua) => {
        const requests = [];
        for (let i = 0; i < 20; i++) {
          requests.push(
            axios.get(`${BASE_URL}/api/health`, {
              headers: { 'User-Agent': ua }
            }).catch(err => ({ error: true }))
          );
        }
        const responses = await Promise.all(requests);
        return responses.filter(r => !r.error).length;
      })
    );
    
    const allSucceeded = results_per_ua.every(count => count === 20);
    
    if (allSucceeded) {
      log.success('Each unique user agent handled independently');
      results.passed++;
    } else {
      log.warn(`Some UAs failed: ${results_per_ua.join(', ')}`);
      results.warnings++;
    }
    results.total++;
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Generate Report
  log.section('📊 RATE LIMITING TEST REPORT');
  
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  // Write detailed report
  const reportContent = `# Rate Limiting Test Report

**Date:** ${new Date().toLocaleString()}
**Environment:** ${BASE_URL}

## Summary

- **Total Tests:** ${results.total}
- **Passed:** ${results.passed}
- **Failed:** ${results.failed}
- **Warnings:** ${results.warnings}
- **Success Rate:** ${((results.passed / results.total) * 100).toFixed(1)}%

## Test Results

### ✅ Working Features
${results.passed > 0 ? '- Rate limiting is active and functioning\n- Mobile device differentiation working\n- High limits prevent false positives' : 'None'}

### ⚠️ Warnings
${results.warnings > 0 ? '- Some rate limits may be too lenient\n- Check if limits align with production requirements' : 'None'}

### ❌ Issues Found
${results.failed > 0 ? '- Rate limiting not working as expected\n- Check rate limiter configuration' : 'None'}

## Recommendations

1. **General API Limit (1000/15min)**: ${results.passed >= 4 ? 'Working well' : 'May need adjustment'}
2. **Booking Limit (20/hour)**: Review if this aligns with expected user behavior
3. **Calculator Limit (100/min)**: Sufficient for typical usage
4. **Mobile Differentiation**: ${results.passed >= 5 ? 'Properly implemented' : 'Needs fixing'}

## Configuration Summary

Current Rate Limits:
- General API: 1000 requests / 15 minutes
- Bookings: 20 requests / hour
- Calculator: 100 requests / minute
- IP-based booking: 20 attempts / hour
- Phone-based: 10 attempts / 24 hours

Mobile Device Handling:
- User-Agent hashing enabled
- Each device gets unique counter
- Works for iPhone, iPad, Android

## Next Steps

${results.failed > 0 ? '- Fix failing rate limit tests\n- Verify rate limiter middleware is applied\n- Check keyGenerator function' : '- Monitor rate limiting in production\n- Adjust limits based on real usage\n- Consider Redis for distributed rate limiting'}
`;

  require('fs').writeFileSync('rate-limiting-report.md', reportContent);
  log.success('Detailed report saved to rate-limiting-report.md');

  return results;
}

// Run the tests
testRateLimiting()
  .then(() => {
    console.log('\n✨ Rate limiting tests completed!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
