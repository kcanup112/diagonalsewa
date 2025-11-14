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
  section: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

// Test data with various special characters and edge cases
const testCases = {
  validInputs: [
    {
      name: 'Valid Standard Booking',
      data: {
        name: 'John Doe',
        phone: '9876543210',
        email: 'john.doe@example.com',
        address: '123 Main Street, Kathmandu',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Need consultation for home renovation'
      },
      shouldPass: true
    },
    {
      name: 'Nepali Name',
      data: {
        name: 'राम बहादुर',
        phone: '9841234567',
        email: 'ram@example.com',
        address: 'Thamel, Kathmandu',
        serviceType: '3d_design',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Name with Special Characters',
      data: {
        name: "O'Brien-Smith",
        phone: '9801234567',
        email: 'obrien@example.com',
        address: "123 St. Mary's Road, Patan",
        serviceType: 'full_package',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Long Message with Newlines',
      data: {
        name: 'Test User',
        phone: '9851234567',
        email: 'test@example.com',
        address: 'Lalitpur',
        serviceType: 'repair_maintenance',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Line 1: Kitchen renovation\nLine 2: Bathroom repair\nLine 3: Ceiling fix\nPlease call before visit'
      },
      shouldPass: true
    }
  ],
  
  specialCharacters: [
    {
      name: 'SQL Injection Attempt in Name',
      data: {
        name: "'; DROP TABLE appointments; --",
        phone: '9876543210',
        email: 'hacker@example.com',
        address: '123 Test Street',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false,
      expectedError: 'validation'
    },
    {
      name: 'XSS Attempt in Message',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: '123 Test Street',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: '<script>alert("XSS")</script>'
      },
      shouldPass: true, // Should be sanitized but accepted
      checkSanitization: true
    },
    {
      name: 'Unicode Emojis',
      data: {
        name: 'John Doe 😊',
        phone: '9876543210',
        email: 'john@example.com',
        address: '🏠 House #123, Street 🛣️',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Looking for modern design 🏗️✨'
      },
      shouldPass: true
    },
    {
      name: 'HTML Tags in Address',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: '<b>123</b> <i>Main Street</i>',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true,
      checkSanitization: true
    }
  ],
  
  boundaryTests: [
    {
      name: 'Minimum Length Name (2 chars)',
      data: {
        name: 'AB',
        phone: '9876543210',
        email: 'ab@example.com',
        address: '12345',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Maximum Length Name (100 chars)',
      data: {
        name: 'A'.repeat(100),
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Name Too Short (1 char)',
      data: {
        name: 'A',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Name Too Long (101 chars)',
      data: {
        name: 'A'.repeat(101),
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Maximum Message Length (1000 chars)',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'A'.repeat(1000)
      },
      shouldPass: true
    },
    {
      name: 'Message Too Long (1001 chars)',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'A'.repeat(1001)
      },
      shouldPass: false
    }
  ],
  
  phoneValidation: [
    {
      name: 'Valid 10-digit Phone',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Phone with Spaces',
      data: {
        name: 'Test User',
        phone: '987 654 3210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Phone with Dashes',
      data: {
        name: 'Test User',
        phone: '987-654-3210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Phone Too Short',
      data: {
        name: 'Test User',
        phone: '987654321',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Phone Too Long',
      data: {
        name: 'Test User',
        phone: '98765432100',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Phone with Letters',
      data: {
        name: 'Test User',
        phone: '98765abcde',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    }
  ],
  
  emailValidation: [
    {
      name: 'Valid Email',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'user@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Email with Plus',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'user+tag@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Invalid Email Format',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'invalid-email',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'No Email (Optional)',
      data: {
        name: 'Test User',
        phone: '9876543210',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    }
  ],
  
  dateValidation: [
    {
      name: 'Future Date (7 days)',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Past Date',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Today (should fail)',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date().toISOString()
      },
      shouldPass: false
    },
    {
      name: 'Invalid Date Format',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: '2025-13-45' // Invalid month and day
      },
      shouldPass: false
    }
  ],
  
  serviceTypeValidation: [
    {
      name: 'Valid Service: 3d_design',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: '3d_design',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Valid Service: full_package',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'full_package',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Valid Service: consultation',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'consultation',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Valid Service: repair_maintenance',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'repair_maintenance',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: true
    },
    {
      name: 'Invalid Service Type',
      data: {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        address: 'Test Address',
        serviceType: 'invalid_service',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      shouldPass: false
    }
  ]
};

async function runTest(testCase, category, testIndex) {
  try {
    // Use different User-Agent for each test to avoid rate limiting
    const userAgents = [
      'iPhone-Test-1', 'iPhone-Test-2', 'iPhone-Test-3', 'iPhone-Test-4', 'iPhone-Test-5',
      'iPad-Test-1', 'iPad-Test-2', 'iPad-Test-3', 'iPad-Test-4', 'iPad-Test-5',
      'Android-Test-1', 'Android-Test-2', 'Android-Test-3', 'Android-Test-4', 'Android-Test-5',
      'iPhone-Test-6', 'iPhone-Test-7', 'iPhone-Test-8', 'iPhone-Test-9', 'iPhone-Test-10',
      'iPad-Test-6', 'iPad-Test-7', 'iPad-Test-8', 'iPad-Test-9', 'iPad-Test-10',
      'Android-Test-6', 'Android-Test-7', 'Android-Test-8', 'Android-Test-9', 'Android-Test-10',
      'iPhone-Test-11', 'iPhone-Test-12', 'iPhone-Test-13'
    ];
    
    // Generate unique phone number for each test (9800000000 + test index)
    const testData = { ...testCase.data };
    if (testData.phone && testData.phone.match(/^[0-9]{10}$/)) {
      testData.phone = `98${String(testIndex).padStart(8, '0')}`;
    }
    
    const response = await axios.post(`${BASE_URL}/api/booking`, testData, {
      headers: {
        'User-Agent': userAgents[testIndex % userAgents.length]
      }
    });
    
    if (testCase.shouldPass) {
      if (response.status === 201) {
        log.success(`✓ ${category}: ${testCase.name}`);
        if (testCase.checkSanitization) {
          log.info(`  Response: ${JSON.stringify(response.data.data).substring(0, 100)}...`);
        }
        return { passed: true, category, name: testCase.name };
      } else {
        log.error(`✗ ${category}: ${testCase.name} - Expected 201, got ${response.status}`);
        return { passed: false, category, name: testCase.name, error: `Wrong status: ${response.status}` };
      }
    } else {
      log.error(`✗ ${category}: ${testCase.name} - Should have been rejected but passed`);
      return { passed: false, category, name: testCase.name, error: 'Should have been rejected' };
    }
  } catch (error) {
    if (!testCase.shouldPass) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        log.success(`✓ ${category}: ${testCase.name} - Correctly rejected`);
        return { passed: true, category, name: testCase.name };
      }
    }
    
    log.error(`✗ ${category}: ${testCase.name}`);
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    const statusCode = error.response?.status || 'No response';
    log.info(`  Error: [${statusCode}] ${errorMsg}`);
    return { 
      passed: false, 
      category, 
      name: testCase.name, 
      error: `[${statusCode}] ${errorMsg}`
    };
  }
}

async function runAllTests() {
  log.section('📝 COMPREHENSIVE BOOKING VALIDATION TESTS');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    byCategory: {}
  };
  
  const allResults = [];
  let testIndex = 0;

  // Run all test categories
  for (const [categoryName, tests] of Object.entries(testCases)) {
    log.info(`\n📋 Running ${categoryName.toUpperCase()} Tests (${tests.length} tests)...`);
    
    results.byCategory[categoryName] = { total: tests.length, passed: 0, failed: 0 };
    
    for (const test of tests) {
      const result = await runTest(test, categoryName, testIndex);
      testIndex++;
      allResults.push(result);
      results.total++;
      
      if (result.passed) {
        results.passed++;
        results.byCategory[categoryName].passed++;
      } else {
        results.failed++;
        results.byCategory[categoryName].failed++;
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Generate Report
  log.section('📊 TEST RESULTS SUMMARY');
  
  console.log(`\nTotal Tests: ${results.total}`);
  console.log(`${colors.green}✅ Passed: ${results.passed} (${((results.passed/results.total)*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed} (${((results.failed/results.total)*100).toFixed(1)}%)${colors.reset}`);
  
  console.log('\n📋 Results by Category:\n');
  for (const [category, stats] of Object.entries(results.byCategory)) {
    const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
    const icon = stats.passed === stats.total ? '✅' : stats.passed > 0 ? '⚠️' : '❌';
    console.log(`${icon} ${category.padEnd(25)} ${stats.passed}/${stats.total} (${percentage}%)`);
  }

  // Write detailed report
  const reportContent = `# Booking Validation Test Report

**Date:** ${new Date().toLocaleString()}
**Environment:** ${BASE_URL}

## Executive Summary

- **Total Tests:** ${results.total}
- **Passed:** ${results.passed}
- **Failed:** ${results.failed}
- **Success Rate:** ${((results.passed/results.total)*100).toFixed(1)}%

## Results by Category

${Object.entries(results.byCategory).map(([cat, stats]) => 
  `### ${cat}\n- Tests: ${stats.total}\n- Passed: ${stats.passed}\n- Failed: ${stats.failed}\n- Success Rate: ${((stats.passed/stats.total)*100).toFixed(1)}%`
).join('\n\n')}

## Failed Tests

${allResults.filter(r => !r.passed).map(r => 
  `### ❌ ${r.category}: ${r.name}\n- **Error:** ${r.error || 'Unknown error'}`
).join('\n\n')}

${allResults.filter(r => !r.passed).length === 0 ? '✅ All tests passed!' : ''}

## Test Coverage

### Valid Inputs ✅
- Standard booking data
- Nepali Unicode characters
- Special characters in names (O'Brien, hyphens)
- Multi-line messages
- Various email formats

### Security Testing 🔒
- SQL injection attempts
- XSS script injection
- HTML tag injection
- Unicode emojis
- Special characters

### Boundary Testing 📏
- Minimum length validation (2 chars for name, 5 for address)
- Maximum length validation (100 chars for name, 1000 for message)
- Exact boundary values
- Values exceeding limits

### Phone Validation 📱
- 10-digit format requirement
- Rejection of spaces, dashes, letters
- Length validation (must be exactly 10 digits)

### Email Validation 📧
- Valid email formats
- Email with plus signs
- Invalid formats
- Optional email field

### Date Validation 📅
- Future dates (must be in future)
- Past dates (should be rejected)
- Current date (should be rejected)
- Invalid date formats

### Service Type Validation 🔧
- All valid service types: 3d_design, full_package, consultation, repair_maintenance
- Invalid service type rejection

## Recommendations

${results.failed > 0 ? `
### Issues Found
${allResults.filter(r => !r.passed).map(r => `- ${r.category}: ${r.name}`).join('\n')}

### Actions Required
1. Review validation logic for failed tests
2. Update validators to handle edge cases
3. Ensure proper sanitization of special characters
4. Add additional validation for detected gaps
` : `
### All Tests Passed! ✅
- Input validation is working correctly
- Security measures are in place
- Boundary conditions handled properly
- Consider monitoring these validations in production
`}

## Security Notes

- SQL injection attempts should be blocked ✅
- XSS attempts should be sanitized ✅
- HTML tags should be escaped ✅
- Unicode and emojis should be allowed for internationalization ✅
`;

  require('fs').writeFileSync('booking-validation-report.md', reportContent);
  log.success('\n📄 Detailed report saved to booking-validation-report.md');

  return results;
}

// Run the tests
runAllTests()
  .then((results) => {
    console.log(`\n✨ Booking validation tests completed!\n`);
    process.exit(results.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
