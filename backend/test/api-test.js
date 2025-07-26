/**
 * API Test Suite for Diagonal Construction Backend
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

class APITester {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async runTests() {
    console.log('🚀 Starting API Tests for Diagonal Construction Backend\n');

    const tests = [
      { name: 'Health Check', test: () => this.testHealthCheck() },
      { name: 'Calculator Health', test: () => this.testCalculatorHealth() },
      { name: 'Cost Calculation', test: () => this.testCostCalculation() },
      { name: 'Quick Estimate', test: () => this.testQuickEstimate() },
      { name: 'Quality Comparison', test: () => this.testQualityComparison() },
      { name: 'Calculator Metrics', test: () => this.testCalculatorMetrics() },
      { name: 'Rate Limiting', test: () => this.testRateLimiting() }
    ];

    let passed = 0;
    let failed = 0;

    for (const { name, test } of tests) {
      try {
        console.log(`🧪 Testing: ${name}`);
        await test();
        console.log(`✅ ${name} - PASSED\n`);
        passed++;
      } catch (error) {
        console.log(`❌ ${name} - FAILED`);
        console.log(`   Error: ${error.message}\n`);
        failed++;
      }
    }

    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    return { passed, failed };
  }

  async testHealthCheck() {
    const response = await this.client.get('/api/health');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.status || response.data.status !== 'OK') {
      throw new Error('Health check status is not OK');
    }

    console.log(`   Response time: ${response.headers['x-response-time'] || 'N/A'}`);
    console.log(`   Database: ${response.data.database?.connected ? 'Connected' : 'Disconnected'}`);
  }

  async testCalculatorHealth() {
    const response = await this.client.get('/api/calculator/health');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success || response.data.status !== 'healthy') {
      throw new Error('Calculator service is not healthy');
    }

    console.log(`   Response time: ${response.data.responseTime}`);
    console.log(`   Capabilities: ${Object.keys(response.data.capabilities).join(', ')}`);
  }

  async testCostCalculation() {
    const testData = {
      plinth_area: 2000,
      floors: 2,
      quality: 'standard',
      project_type: 'residential'
    };

    const response = await this.client.post('/api/calculator/calculate', testData);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error('Cost calculation failed');
    }

    const { costEstimation, timeline } = response.data.data;
    
    if (!costEstimation || !costEstimation.totalCost) {
      throw new Error('Missing cost estimation data');
    }

    if (!timeline || !timeline.phases) {
      throw new Error('Missing timeline data');
    }

    console.log(`   Total Cost: ₹${costEstimation.totalCost.toLocaleString()}`);
    console.log(`   Rate per sq ft: ₹${costEstimation.ratePerSqFt}`);
    console.log(`   Timeline phases: ${timeline.phases.length}`);
  }

  async testQuickEstimate() {
    const response = await this.client.get('/api/calculator/quick-estimate/1500');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error('Quick estimate failed');
    }

    console.log(`   Quick estimate for 1500 sq ft: ₹${response.data.data.estimates.standard.totalCost.toLocaleString()}`);
  }

  async testQualityComparison() {
    const testData = {
      plinth_area: 1000,
      project_type: 'residential'
    };

    const response = await this.client.post('/api/calculator/compare-options', testData);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error('Quality comparison failed');
    }

    const comparisons = response.data.data.comparisons;
    console.log(`   Quality options: ${Object.keys(comparisons).join(', ')}`);
  }

  async testCalculatorMetrics() {
    const response = await this.client.get('/api/calculator/metrics');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error('Metrics retrieval failed');
    }

    console.log(`   Uptime: ${Math.round(response.data.metrics.uptime)}s`);
    console.log(`   Memory usage: ${Math.round(response.data.metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`);
  }

  async testRateLimiting() {
    // Test by making multiple rapid requests
    const promises = Array(5).fill().map(() => 
      this.client.get('/api/health')
    );

    const responses = await Promise.all(promises);
    
    // All should succeed (within rate limit)
    responses.forEach((response, index) => {
      if (response.status !== 200) {
        throw new Error(`Request ${index + 1} failed with status ${response.status}`);
      }
    });

    console.log(`   Made 5 rapid requests - all succeeded (within rate limit)`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new APITester();
  
  tester.runTests()
    .then(({ passed, failed }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = APITester;
