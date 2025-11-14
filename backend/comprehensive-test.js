/**
 * Comprehensive Test Suite for Diagonal Construction API
 * Tests all endpoints with various scenarios including edge cases
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000';
const bugs = [];
const testResults = [];

// Test configuration
let adminToken = null;
let createdAppointmentId = null;
let createdOfferId = null;
let createdTeamId = null;
let createdPortfolioId = null;

// Helper function to log test results
function logTest(category, test, status, details = '') {
  const result = {
    category,
    test,
    status,
    details,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusIcon} [${category}] ${test}`);
  if (details) console.log(`   ${details}`);
  
  if (status === 'FAIL' || status === 'BUG') {
    bugs.push(result);
  }
}

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        ...headers,
        ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
      }
    };
    
    if (data) {
      if (data instanceof FormData) {
        config.data = data;
        config.headers = { ...config.headers, ...data.getHeaders() };
      } else {
        config.data = data;
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// ============================================
// TEST SUITES
// ============================================

async function testHealthEndpoint() {
  console.log('\n📊 Testing Health Endpoint...\n');
  
  const result = await makeRequest('GET', '/api/health');
  if (result.success && result.data.status === 'OK') {
    logTest('Health', 'API health check', 'PASS', 'API is running');
  } else {
    logTest('Health', 'API health check', 'FAIL', 'API not responding properly');
  }
  
  if (result.data?.database?.connected) {
    logTest('Health', 'Database connection', 'PASS', 'Database connected');
  } else {
    logTest('Health', 'Database connection', 'BUG', result.data?.database?.error || 'Database not connected');
  }
}

async function testAdminAuthentication() {
  console.log('\n🔐 Testing Admin Authentication...\n');
  
  // Test 1: Valid login
  let result = await makeRequest('POST', '/api/admin/login', {
    username: 'admin',
    password: '@!$%^&*(Axcd)'
  });
  
  if (result.success && result.data.data?.token) {
    adminToken = result.data.data.token;
    logTest('Auth', 'Admin login with valid credentials', 'PASS');
  } else {
    logTest('Auth', 'Admin login with valid credentials', 'BUG', JSON.stringify(result.error));
  }
  
  // Test 2: Invalid password
  result = await makeRequest('POST', '/api/admin/login', {
    username: 'admin',
    password: 'wrongpassword'
  });
  
  if (!result.success && result.status === 401) {
    logTest('Auth', 'Reject invalid password', 'PASS');
  } else {
    logTest('Auth', 'Reject invalid password', 'BUG', 'Should reject invalid password with 401');
  }
  
  // Test 3: Non-existent user
  result = await makeRequest('POST', '/api/admin/login', {
    username: 'nonexistent',
    password: 'password123'
  });
  
  if (!result.success && result.status === 401) {
    logTest('Auth', 'Reject non-existent user', 'PASS');
  } else {
    logTest('Auth', 'Reject non-existent user', 'BUG', 'Should reject non-existent user');
  }
  
  // Test 4: Missing credentials
  result = await makeRequest('POST', '/api/admin/login', {});
  
  if (!result.success && result.status === 400) {
    logTest('Auth', 'Reject empty credentials', 'PASS');
  } else {
    logTest('Auth', 'Reject empty credentials', 'BUG', 'Should validate required fields');
  }
  
  // Test 5: SQL Injection attempt
  result = await makeRequest('POST', '/api/admin/login', {
    username: "admin' OR '1'='1",
    password: "password' OR '1'='1"
  });
  
  if (!result.success) {
    logTest('Auth', 'Prevent SQL injection', 'PASS');
  } else {
    logTest('Auth', 'Prevent SQL injection', 'BUG', 'Potential SQL injection vulnerability');
  }
}

async function testBookingEndpoint() {
  console.log('\n📅 Testing Booking Endpoints...\n');
  
  // Test 1: Create booking with valid data
  const validBooking = {
    name: 'Test User',
    phone: '9876543210',
    email: 'test@example.com',
    address: 'Test Address',
    ward: '1',
    municipality: 'Test Municipality',
    serviceType: '3d_design',
    appointmentDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    message: 'Test message'
  };
  
  let result = await makeRequest('POST', '/api/booking', validBooking);
  
  if (result.success && result.data.data?.appointmentId) {
    createdAppointmentId = result.data.data.appointmentId;
    logTest('Booking', 'Create valid appointment', 'PASS');
  } else {
    logTest('Booking', 'Create valid appointment', 'BUG', JSON.stringify(result.error));
  }
  
  // Test 2: Create booking without required fields
  result = await makeRequest('POST', '/api/booking', {
    name: 'Test'
  });
  
  if (!result.success && result.status === 400) {
    logTest('Booking', 'Reject incomplete booking', 'PASS');
  } else {
    logTest('Booking', 'Reject incomplete booking', 'BUG', 'Should validate required fields');
  }
  
  // Test 3: Create booking with past date
  result = await makeRequest('POST', '/api/booking', {
    ...validBooking,
    appointmentDate: new Date(Date.now() - 86400000).toISOString() // Yesterday
  });
  
  if (!result.success && result.status === 400) {
    logTest('Booking', 'Reject past appointment date', 'PASS');
  } else {
    logTest('Booking', 'Reject past appointment date', 'BUG', 'Should not allow past dates');
  }
  
  // Test 4: Create booking with invalid phone
  result = await makeRequest('POST', '/api/booking', {
    ...validBooking,
    phone: '123' // Too short
  });
  
  if (!result.success && result.status === 400) {
    logTest('Booking', 'Validate phone number format', 'PASS');
  } else {
    logTest('Booking', 'Validate phone number format', 'WARN', 'Phone validation might be weak');
  }
  
  // Test 5: Create booking with invalid service type
  result = await makeRequest('POST', '/api/booking', {
    ...validBooking,
    serviceType: 'invalid_service'
  });
  
  if (!result.success && result.status === 400) {
    logTest('Booking', 'Validate service type', 'PASS');
  } else {
    logTest('Booking', 'Validate service type', 'BUG', 'Should validate service type enum');
  }
  
  // Test 6: Get appointment by ID
  if (createdAppointmentId) {
    result = await makeRequest('GET', `/api/booking/${createdAppointmentId}`);
    
    if (result.success && result.data.data) {
      logTest('Booking', 'Retrieve appointment by ID', 'PASS');
    } else {
      logTest('Booking', 'Retrieve appointment by ID', 'BUG', 'Failed to retrieve created appointment');
    }
  }
  
  // Test 7: Get non-existent appointment
  result = await makeRequest('GET', '/api/booking/99999');
  
  if (!result.success && result.status === 404) {
    logTest('Booking', 'Handle non-existent appointment', 'PASS');
  } else {
    logTest('Booking', 'Handle non-existent appointment', 'WARN', 'Should return 404 for non-existent');
  }
  
  // Test 8: Check availability for valid date
  const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  result = await makeRequest('GET', `/api/booking/check-availability/${futureDate}`);
  
  if (result.success && typeof result.data.data?.isAvailable === 'boolean') {
    logTest('Booking', 'Check date availability', 'PASS');
  } else {
    logTest('Booking', 'Check date availability', 'BUG', 'Availability check not working');
  }
  
  // Test 9: Check availability for past date
  const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  result = await makeRequest('GET', `/api/booking/check-availability/${pastDate}`);
  
  if (!result.success && result.status === 400) {
    logTest('Booking', 'Reject past date availability check', 'PASS');
  } else {
    logTest('Booking', 'Reject past date availability check', 'WARN', 'Should not allow checking past dates');
  }
  
  // Test 10: Get services list
  result = await makeRequest('GET', '/api/booking/services/list');
  
  if (result.success && Array.isArray(result.data.data)) {
    logTest('Booking', 'Retrieve services list', 'PASS');
  } else {
    logTest('Booking', 'Retrieve services list', 'BUG', 'Services list endpoint not working');
  }
}

async function testAdminDashboard() {
  console.log('\n📊 Testing Admin Dashboard...\n');
  
  if (!adminToken) {
    logTest('Admin', 'Dashboard access', 'FAIL', 'No admin token available');
    return;
  }
  
  // Test 1: Get dashboard data
  let result = await makeRequest('GET', '/api/admin/dashboard');
  
  if (result.success && result.data.data?.statistics) {
    logTest('Admin', 'Retrieve dashboard statistics', 'PASS');
  } else {
    logTest('Admin', 'Retrieve dashboard statistics', 'BUG', JSON.stringify(result.error));
  }
  
  // Test 2: Get appointments list
  result = await makeRequest('GET', '/api/admin/appointments');
  
  if (result.success && result.data.data?.appointments) {
    logTest('Admin', 'Retrieve appointments list', 'PASS');
  } else {
    logTest('Admin', 'Retrieve appointments list', 'BUG', 'Failed to get appointments');
  }
  
  // Test 3: Get appointments with pagination
  result = await makeRequest('GET', '/api/admin/appointments?page=1&limit=10');
  
  if (result.success && result.data.data?.pagination) {
    logTest('Admin', 'Appointments pagination', 'PASS');
  } else {
    logTest('Admin', 'Appointments pagination', 'WARN', 'Pagination might not be working');
  }
  
  // Test 4: Filter appointments by status
  result = await makeRequest('GET', '/api/admin/appointments?status=pending');
  
  if (result.success) {
    logTest('Admin', 'Filter appointments by status', 'PASS');
  } else {
    logTest('Admin', 'Filter appointments by status', 'BUG', 'Status filtering failed');
  }
  
  // Test 5: Update appointment status
  if (createdAppointmentId) {
    result = await makeRequest('PUT', `/api/admin/appointments/${createdAppointmentId}/status`, {
      status: 'confirmed',
      notes: 'Test confirmation'
    });
    
    if (result.success) {
      logTest('Admin', 'Update appointment status', 'PASS');
    } else {
      logTest('Admin', 'Update appointment status', 'BUG', JSON.stringify(result.error));
    }
  }
  
  // Test 6: Update with invalid status
  if (createdAppointmentId) {
    result = await makeRequest('PUT', `/api/admin/appointments/${createdAppointmentId}/status`, {
      status: 'invalid_status'
    });
    
    if (!result.success && result.status === 400) {
      logTest('Admin', 'Reject invalid status', 'PASS');
    } else {
      logTest('Admin', 'Reject invalid status', 'BUG', 'Should validate status enum');
    }
  }
}

async function testOffersEndpoint() {
  console.log('\n🎁 Testing Offers Endpoints...\n');
  
  // Test 1: Get all offers
  let result = await makeRequest('GET', '/api/offers');
  
  if (result.success) {
    logTest('Offers', 'Retrieve offers list', 'PASS');
  } else {
    logTest('Offers', 'Retrieve offers list', 'BUG', 'Failed to get offers');
  }
  
  // Test 2: Get active offers
  result = await makeRequest('GET', '/api/offers/active');
  
  if (result.success) {
    logTest('Offers', 'Retrieve active offers', 'PASS');
  } else {
    logTest('Offers', 'Retrieve active offers', 'BUG', 'Active offers endpoint failed');
  }
  
  // Test 3: Get popup offers
  result = await makeRequest('GET', '/api/offers/popups');
  
  if (result.success) {
    logTest('Offers', 'Retrieve popup offers', 'PASS');
  } else {
    logTest('Offers', 'Retrieve popup offers', 'BUG', 'Popup offers endpoint failed');
  }
  
  if (!adminToken) return;
  
  // Test 4: Create offer (admin only)
  const newOffer = {
    title: 'Test Offer',
    description: 'Test offer description',
    offerType: 'discount',
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    isActive: true,
    targetAudience: [],
    images: [],
    videos: []
  };
  
  result = await makeRequest('POST', '/api/offers', newOffer);
  
  if (result.success && result.data.data?.id) {
    createdOfferId = result.data.data.id;
    logTest('Offers', 'Create new offer', 'PASS');
  } else {
    logTest('Offers', 'Create new offer', 'BUG', JSON.stringify(result.error));
  }
  
  // Test 5: Create offer with invalid dates (end before start)
  result = await makeRequest('POST', '/api/offers', {
    ...newOffer,
    startDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    endDate: new Date().toISOString()
  });
  
  if (!result.success && result.status === 400) {
    logTest('Offers', 'Reject invalid date range', 'PASS');
  } else {
    logTest('Offers', 'Reject invalid date range', 'BUG', 'Should validate date range');
  }
}

async function testTeamEndpoint() {
  console.log('\n👥 Testing Team Endpoints...\n');
  
  // Test 1: Get all team members
  let result = await makeRequest('GET', '/api/team');
  
  if (result.success) {
    logTest('Team', 'Retrieve team members', 'PASS');
  } else {
    logTest('Team', 'Retrieve team members', 'BUG', 'Failed to get team members');
  }
  
  if (!adminToken) return;
  
  // Test 2: Create team member
  const newMember = {
    name: 'Test Member',
    position: 'Test Position',
    experience: '5 years',
    overview: 'Test overview',
    email: 'test@diagonal.com',
    isActive: true,
    displayOrder: 1,
    qualifications: [],
    certifications: []
  };
  
  result = await makeRequest('POST', '/api/team', newMember);
  
  if (result.success && result.data.data?.id) {
    createdTeamId = result.data.data.id;
    logTest('Team', 'Create team member', 'PASS');
  } else {
    logTest('Team', 'Create team member', 'BUG', JSON.stringify(result.error));
  }
  
  // Test 3: Create team member without required fields
  result = await makeRequest('POST', '/api/team', {
    name: 'Test'
  });
  
  if (!result.success && result.status === 400) {
    logTest('Team', 'Validate required fields', 'PASS');
  } else {
    logTest('Team', 'Validate required fields', 'WARN', 'Field validation might be weak');
  }
}

async function testCalculatorEndpoint() {
  console.log('\n🧮 Testing Calculator Endpoints...\n');
  
  // Test 1: Full calculation
  const calcData = {
    area: 1500,
    projectType: 'residential',
    floors: 2,
    quality: 'standard',
    location: 'urban'
  };
  
  let result = await makeRequest('POST', '/api/calculator/calculate', calcData);
  
  if (result.success && result.data.data?.totalCost) {
    logTest('Calculator', 'Full cost calculation', 'PASS');
  } else {
    logTest('Calculator', 'Full cost calculation', 'BUG', 'Calculation failed');
  }
  
  // Test 2: Quick estimate
  result = await makeRequest('GET', '/api/calculator/quick-estimate/1500');
  
  if (result.success && result.data.data?.estimatedCost) {
    logTest('Calculator', 'Quick estimate', 'PASS');
  } else {
    logTest('Calculator', 'Quick estimate', 'BUG', 'Quick estimate failed');
  }
  
  // Test 3: Calculate with invalid area (negative)
  result = await makeRequest('POST', '/api/calculator/calculate', {
    ...calcData,
    area: -100
  });
  
  if (!result.success && result.status === 400) {
    logTest('Calculator', 'Reject negative area', 'PASS');
  } else {
    logTest('Calculator', 'Reject negative area', 'BUG', 'Should validate area > 0');
  }
  
  // Test 4: Calculate with unrealistic area (too large)
  result = await makeRequest('POST', '/api/calculator/calculate', {
    ...calcData,
    area: 1000000 // 1 million sq ft
  });
  
  if (!result.success || result.data.data?.totalCost < 1000000000000) {
    logTest('Calculator', 'Handle large area values', 'WARN', 'Should validate maximum area');
  } else {
    logTest('Calculator', 'Handle large area values', 'PASS');
  }
  
  // Test 5: Get current rates
  result = await makeRequest('GET', '/api/calculator/rates');
  
  if (result.success && result.data.data?.rates) {
    logTest('Calculator', 'Retrieve current rates', 'PASS');
  } else {
    logTest('Calculator', 'Retrieve current rates', 'WARN', 'Rates endpoint might be missing');
  }
}

async function testPortfolioEndpoint() {
  console.log('\n📸 Testing Portfolio Endpoints...\n');
  
  // Test 1: Get all portfolios
  let result = await makeRequest('GET', '/api/portfolios');
  
  if (result.success) {
    logTest('Portfolio', 'Retrieve portfolios', 'PASS');
  } else {
    logTest('Portfolio', 'Retrieve portfolios', 'BUG', 'Failed to get portfolios');
  }
  
  if (!adminToken) return;
  
  // Test 2: Create portfolio
  const newPortfolio = {
    title: 'Test Project',
    description: 'Test project description',
    area: '2000 sq ft',
    location: 'Test Location',
    projectType: 'residential',
    completionDate: new Date().toISOString(),
    images: [],
    videos: [],
    youtubeUrls: []
  };
  
  result = await makeRequest('POST', '/api/portfolios', newPortfolio);
  
  if (result.success && result.data.data?.id) {
    createdPortfolioId = result.data.data.id;
    logTest('Portfolio', 'Create portfolio', 'PASS');
  } else {
    logTest('Portfolio', 'Create portfolio', 'BUG', JSON.stringify(result.error));
  }
}

async function testSecurityScenarios() {
  console.log('\n🔒 Testing Security Scenarios...\n');
  
  // Test 1: Access admin endpoint without token
  let result = await makeRequest('GET', '/api/admin/appointments', null, {});
  
  if (!result.success && result.status === 401) {
    logTest('Security', 'Protect admin endpoints', 'PASS');
  } else {
    logTest('Security', 'Protect admin endpoints', 'BUG', 'Admin endpoints should require authentication');
  }
  
  // Test 2: Access with invalid token
  result = await makeRequest('GET', '/api/admin/appointments', null, {
    'Authorization': 'Bearer invalid_token'
  });
  
  if (!result.success && result.status === 401) {
    logTest('Security', 'Reject invalid tokens', 'PASS');
  } else {
    logTest('Security', 'Reject invalid tokens', 'BUG', 'Should validate JWT tokens');
  }
  
  // Test 3: XSS attempt in booking
  result = await makeRequest('POST', '/api/booking', {
    name: '<script>alert("XSS")</script>',
    phone: '9876543210',
    address: 'Test',
    serviceType: '3d_design',
    appointmentDate: new Date(Date.now() + 86400000).toISOString()
  });
  
  if (result.success) {
    // Check if the name was sanitized
    const appointment = await makeRequest('GET', `/api/booking/${result.data.data.appointmentId}`);
    if (appointment.data.data.name.includes('<script>')) {
      logTest('Security', 'Prevent XSS attacks', 'BUG', 'Input not sanitized');
    } else {
      logTest('Security', 'Prevent XSS attacks', 'PASS');
    }
  } else {
    logTest('Security', 'Prevent XSS attacks', 'WARN', 'Could not test XSS');
  }
  
  // Test 4: Extremely long input (DOS attempt)
  const longString = 'A'.repeat(100000);
  result = await makeRequest('POST', '/api/booking', {
    name: longString,
    phone: '9876543210',
    address: 'Test',
    serviceType: '3d_design',
    appointmentDate: new Date(Date.now() + 86400000).toISOString()
  });
  
  if (!result.success && result.status === 400) {
    logTest('Security', 'Prevent DOS via long input', 'PASS');
  } else {
    logTest('Security', 'Prevent DOS via long input', 'WARN', 'Should limit input length');
  }
}

async function testEdgeCases() {
  console.log('\n⚠️  Testing Edge Cases...\n');
  
  // Test 1: Get appointment with string ID instead of number
  let result = await makeRequest('GET', '/api/booking/abc');
  
  if (!result.success) {
    logTest('Edge Cases', 'Handle non-numeric ID', 'PASS');
  } else {
    logTest('Edge Cases', 'Handle non-numeric ID', 'WARN', 'Should validate ID format');
  }
  
  // Test 2: Booking with special characters in name
  result = await makeRequest('POST', '/api/booking', {
    name: 'Test™®©',
    phone: '9876543210',
    address: 'Test',
    serviceType: '3d_design',
    appointmentDate: new Date(Date.now() + 86400000).toISOString()
  });
  
  if (result.success) {
    logTest('Edge Cases', 'Handle special characters', 'PASS');
  } else {
    logTest('Edge Cases', 'Handle special characters', 'WARN', 'Should allow international characters');
  }
  
  // Test 3: Empty string vs null vs undefined
  result = await makeRequest('POST', '/api/booking', {
    name: 'Test',
    phone: '9876543210',
    address: 'Test',
    email: '', // Empty string
    serviceType: '3d_design',
    appointmentDate: new Date(Date.now() + 86400000).toISOString()
  });
  
  if (result.success || result.status === 400) {
    logTest('Edge Cases', 'Handle empty optional fields', 'PASS');
  } else {
    logTest('Edge Cases', 'Handle empty optional fields', 'WARN', 'Empty field handling unclear');
  }
  
  // Test 4: Concurrent requests (rate limiting)
  console.log('   Testing rate limiting with concurrent requests...');
  const promises = [];
  for (let i = 0; i < 50; i++) {
    promises.push(makeRequest('GET', '/api/health'));
  }
  
  const results = await Promise.all(promises);
  const tooManyRequests = results.filter(r => r.status === 429);
  
  if (tooManyRequests.length > 0) {
    logTest('Edge Cases', 'Rate limiting active', 'PASS');
  } else {
    logTest('Edge Cases', 'Rate limiting active', 'WARN', 'No rate limiting detected');
  }
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport() {
  const totalTests = testResults.length;
  const passed = testResults.filter(t => t.status === 'PASS').length;
  const failed = testResults.filter(t => t.status === 'FAIL').length;
  const bugsFound = testResults.filter(t => t.status === 'BUG').length;
  const warnings = testResults.filter(t => t.status === 'WARN').length;
  
  let report = `# Diagonal Construction API - Test Report\n\n`;
  report += `**Date:** ${new Date().toLocaleString()}\n`;
  report += `**Test Environment:** ${API_URL}\n\n`;
  
  report += `## Executive Summary\n\n`;
  report += `- **Total Tests:** ${totalTests}\n`;
  report += `- **Passed:** ${passed} (${((passed/totalTests)*100).toFixed(1)}%)\n`;
  report += `- **Failed:** ${failed}\n`;
  report += `- **Bugs Found:** ${bugsFound}\n`;
  report += `- **Warnings:** ${warnings}\n\n`;
  
  report += `## Test Coverage\n\n`;
  const categories = [...new Set(testResults.map(t => t.category))];
  categories.forEach(cat => {
    const catTests = testResults.filter(t => t.category === cat);
    const catPassed = catTests.filter(t => t.status === 'PASS').length;
    report += `- **${cat}:** ${catPassed}/${catTests.length} passed\n`;
  });
  
  report += `\n## Critical Bugs Found\n\n`;
  if (bugs.length === 0) {
    report += `✅ No critical bugs detected!\n\n`;
  } else {
    bugs.forEach((bug, index) => {
      report += `### ${index + 1}. ${bug.test}\n`;
      report += `- **Category:** ${bug.category}\n`;
      report += `- **Severity:** ${bug.status === 'FAIL' ? 'HIGH' : bug.status === 'BUG' ? 'MEDIUM' : 'LOW'}\n`;
      report += `- **Details:** ${bug.details}\n`;
      report += `- **Timestamp:** ${bug.timestamp}\n\n`;
    });
  }
  
  report += `## Detailed Test Results\n\n`;
  categories.forEach(cat => {
    report += `### ${cat}\n\n`;
    const catTests = testResults.filter(t => t.category === cat);
    catTests.forEach(test => {
      const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : test.status === 'BUG' ? '🐛' : '⚠️';
      report += `${icon} **${test.test}** - ${test.status}\n`;
      if (test.details) {
        report += `   - ${test.details}\n`;
      }
    });
    report += `\n`;
  });
  
  report += `## Recommendations\n\n`;
  if (bugsFound > 0) {
    report += `1. **Fix Critical Bugs:** Address all bugs marked as BUG before production deployment\n`;
  }
  if (warnings > 0) {
    report += `2. **Review Warnings:** Investigate all warnings to ensure they're not security vulnerabilities\n`;
  }
  if (testResults.some(t => t.test.includes('SQL injection'))) {
    report += `3. **Security Audit:** Conduct a thorough security audit focusing on input validation\n`;
  }
  if (testResults.some(t => t.test.includes('rate limiting'))) {
    report += `4. **Rate Limiting:** Ensure rate limiting is properly configured for all public endpoints\n`;
  }
  report += `5. **Unit Tests:** Add automated unit tests for all new features\n`;
  report += `6. **Integration Tests:** Set up CI/CD pipeline with integration tests\n`;
  
  return report;
}

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Tests...\n');
  console.log('=' .repeat(50));
  
  try {
    await testHealthEndpoint();
    await testAdminAuthentication();
    await testBookingEndpoint();
    await testAdminDashboard();
    await testOffersEndpoint();
    await testTeamEndpoint();
    await testCalculatorEndpoint();
    await testPortfolioEndpoint();
    await testSecurityScenarios();
    await testEdgeCases();
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Generating Report...\n');
    
    const report = generateReport();
    
    // Save report to file
    fs.writeFileSync('report.md', report);
    console.log('✅ Report saved to report.md\n');
    
    // Print summary
    const totalTests = testResults.length;
    const passed = testResults.filter(t => t.status === 'PASS').length;
    const bugsFound = testResults.filter(t => t.status === 'BUG').length;
    
    console.log('📈 SUMMARY:');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Bugs Found: ${bugsFound}`);
    console.log(`   Success Rate: ${((passed/totalTests)*100).toFixed(1)}%\n`);
    
    if (bugsFound > 0) {
      console.log('⚠️  Please review report.md for detailed bug information\n');
      process.exit(1);
    } else {
      console.log('✅ All tests passed!\n');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
