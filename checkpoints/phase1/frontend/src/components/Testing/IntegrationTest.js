/**
 * Integration Test Component
 * Tests frontend-backend connectivity and API functionality
 */

import React, { useState, useEffect } from 'react';
import { calculatorService, bookingService } from '../../services';

const IntegrationTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testSummary, setTestSummary] = useState({ passed: 0, failed: 0, total: 0 });

  const addResult = (testName, success, message, data = null) => {
    const result = {
      testName,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTestResults(prev => [...prev, result]);
    setTestSummary(prev => ({
      passed: prev.passed + (success ? 1 : 0),
      failed: prev.failed + (success ? 0 : 1),
      total: prev.total + 1
    }));
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setTestSummary({ passed: 0, failed: 0, total: 0 });

    const tests = [
      {
        name: 'Calculator Health Check',
        test: async () => {
          const response = await calculatorService.getHealth();
          if (response.success && response.status === 'healthy') {
            return { success: true, message: `Response time: ${response.responseTime}`, data: response };
          }
          throw new Error('Health check failed');
        }
      },
      {
        name: 'Cost Calculation',
        test: async () => {
          const testData = {
            plinth_area: 1500,
            floors: 2,
            quality: 'standard',
            project_type: 'residential'
          };
          const response = await calculatorService.calculateCost(testData);
          if (response.success && response.data.costEstimation) {
            return { 
              success: true, 
              message: `Total Cost: ₹${response.data.costEstimation.totalCost.toLocaleString()}`,
              data: response.data.costEstimation
            };
          }
          throw new Error('Cost calculation failed');
        }
      },
      {
        name: 'Quick Estimate',
        test: async () => {
          const area = 1000;
          const response = await calculatorService.getQuickEstimate(area);
          if (response.success && response.data.estimatedCost) {
            return { 
              success: true, 
              message: `Estimate: ₹${response.data.estimatedCost.toLocaleString()}`,
              data: response.data
            };
          }
          throw new Error('Quick estimate failed');
        }
      },
      {
        name: 'Construction Rates',
        test: async () => {
          const response = await calculatorService.getRates();
          if (response.success && response.data.rates) {
            return { 
              success: true, 
              message: `Rates loaded successfully`,
              data: response.data.rates
            };
          }
          throw new Error('Rates fetch failed');
        }
      },
      {
        name: 'Options Comparison',
        test: async () => {
          const testData = {
            areas: [1000, 1500, 2000],
            quality: 'standard'
          };
          const response = await calculatorService.compareOptions(testData);
          if (response.success && response.data.comparisons) {
            return { 
              success: true, 
              message: `Compared ${response.data.comparisons.length} options`,
              data: response.data.comparisons
            };
          }
          throw new Error('Options comparison failed');
        }
      },
      {
        name: 'Timeline Generation',
        test: async () => {
          const response = await calculatorService.getTimeline(1500, 'residential');
          if (response.success && response.data.timeline) {
            return { 
              success: true, 
              message: `Timeline: ${response.data.timeline.phases?.length || 0} phases`,
              data: response.data.timeline
            };
          }
          throw new Error('Timeline generation failed');
        }
      },
      {
        name: 'Booking Services List',
        test: async () => {
          const response = await bookingService.getServices();
          if (response.success && response.data) {
            return { 
              success: true, 
              message: `Services loaded: ${response.data.length || 0}`,
              data: response.data
            };
          }
          throw new Error('Services fetch failed');
        }
      }
    ];

    for (const { name, test } of tests) {
      try {
        const result = await test();
        addResult(name, true, result.message, result.data);
      } catch (error) {
        addResult(name, false, error.message || 'Unknown error', null);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  const getStatusIcon = (success) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C2E7C9] via-white to-[#F2AC20]/20 font-sofia-pro">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C2E7C9] to-[#F2AC20]/30 px-6 py-12">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4265D6] rounded-3xl mb-6 shadow-2xl">
            <div className="text-white text-3xl">🔧</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#293855] mb-4">
            Integration Testing
          </h1>
          <p className="text-xl text-[#293855]/70 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect connection between your frontend and backend systems
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Test Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4265D6] to-[#4265D6]/80 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-[#4265D6]/10">
              <div className="text-4xl font-bold text-[#4265D6] mb-2">{testSummary.total}</div>
              <div className="text-[#293855] font-semibold">Total Tests</div>
              <div className="absolute top-4 right-4 text-[#4265D6]/20 text-2xl">📊</div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C2E7C9] to-[#C2E7C9]/80 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-[#C2E7C9]/30">
              <div className="text-4xl font-bold text-green-600 mb-2">{testSummary.passed}</div>
              <div className="text-[#293855] font-semibold">Passed</div>
              <div className="absolute top-4 right-4 text-green-200 text-2xl">✅</div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2AC20] to-[#F2AC20]/80 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-[#F2AC20]/20">
              <div className="text-4xl font-bold text-red-500 mb-2">{testSummary.failed}</div>
              <div className="text-[#293855] font-semibold">Failed</div>
              <div className="absolute top-4 right-4 text-red-200 text-2xl">❌</div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#293855] to-[#293855]/80 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-[#293855]/10">
              <div className="text-4xl font-bold text-[#293855] mb-2">
                {testSummary.total > 0 ? Math.round((testSummary.passed / testSummary.total) * 100) : 0}%
              </div>
              <div className="text-[#293855] font-semibold">Success Rate</div>
              <div className="absolute top-4 right-4 text-[#293855]/20 text-2xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#C2E7C9]/20 overflow-hidden">
          {/* Test Controls */}
          <div className="bg-gradient-to-r from-[#C2E7C9]/20 to-[#F2AC20]/10 px-8 py-6 border-b border-[#C2E7C9]/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#293855] mb-2">Test Suite</h2>
                <p className="text-[#293855]/60">Monitor your system integration health</p>
              </div>
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isRunning 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#4265D6] to-[#4265D6]/80 text-white shadow-xl hover:shadow-2xl'
                }`}
              >
                <div className="relative z-10 flex items-center space-x-3">
                  <span className="text-2xl">{isRunning ? '🔄' : '▶️'}</span>
                  <span>{isRunning ? 'Running Tests...' : 'Start Tests'}</span>
                </div>
                {!isRunning && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4265D6]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div className="p-8">
            {testResults.length === 0 && !isRunning && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-[#C2E7C9]/20 rounded-full mb-6">
                  <div className="text-4xl">🚀</div>
                </div>
                <h3 className="text-2xl font-bold text-[#293855] mb-3">Ready to Test</h3>
                <p className="text-[#293855]/60 max-w-md mx-auto">
                  Click "Start Tests" to begin comprehensive integration testing
                </p>
              </div>
            )}

            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg ${
                    result.success 
                      ? 'bg-gradient-to-r from-green-50 to-[#C2E7C9]/20 border border-green-200/50' 
                      : 'bg-gradient-to-r from-red-50 to-[#F2AC20]/20 border border-red-200/50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                            result.success 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {getStatusIcon(result.success)}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#293855] text-lg">{result.testName}</h4>
                            <div className="flex items-center space-x-2 text-sm text-[#293855]/60">
                              <span>🕒</span>
                              <span>{result.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-medium mb-3 ${getStatusColor(result.success)}`}>
                          {result.message}
                        </div>
                        {result.data && (
                          <details className="group/details">
                            <summary className="cursor-pointer flex items-center space-x-2 text-[#4265D6] hover:text-[#4265D6]/80 transition-colors duration-200">
                              <span className="w-6 h-6 bg-[#4265D6]/10 rounded-lg flex items-center justify-center text-sm">📄</span>
                              <span className="font-medium">View Response Data</span>
                              <span className="text-sm group-open/details:rotate-180 transition-transform duration-200">⌄</span>
                            </summary>
                            <div className="mt-4 p-4 bg-[#293855]/5 rounded-xl border border-[#293855]/10">
                              <pre className="text-sm text-[#293855] overflow-auto max-h-48 leading-relaxed">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    result.success ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                </div>
              ))}
            </div>

            {isRunning && (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-[#4265D6]/20 border-t-[#4265D6] animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-[#F2AC20] animate-spin animate-reverse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#293855]">Running Tests</div>
                    <div className="text-[#293855]/60">Please wait while we test your integration...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integration Status */}
        {testSummary.total > 0 && (
          <div className="mt-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C2E7C9] to-[#F2AC20] rounded-3xl opacity-10"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-[#C2E7C9]/30">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                  testSummary.failed === 0 
                    ? 'bg-[#C2E7C9]/20 text-green-600' 
                    : 'bg-[#F2AC20]/20 text-orange-600'
                }`}>
                  {testSummary.failed === 0 ? '🎉' : '⚠️'}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#293855] mb-2">Integration Status</h4>
                  <div className="text-lg">
                    {testSummary.failed === 0 ? (
                      <span className="text-green-600 font-medium">
                        All systems operational! Frontend and backend are perfectly integrated.
                      </span>
                    ) : (
                      <span className="text-orange-600 font-medium">
                        Some tests need attention. Review the results above for optimization opportunities.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationTest;
