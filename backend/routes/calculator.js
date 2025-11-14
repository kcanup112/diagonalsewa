const express = require('express');
const { body, validationResult } = require('express-validator');

const CostCalculator = require('../utils/costCalculator');
const GanttDataGenerator = require('../utils/ganttData');
const logger = require('../utils/logger');
const { validate } = require('../utils/validation');
const { calculationLimiter } = require('../utils/rateLimiting');
const { AppError } = require('../utils/errors');

const router = express.Router();

// Apply rate limiting to calculation endpoints
router.use('/calculate', calculationLimiter);

// Validation rules for cost calculation
const calculateValidation = [
  body('plinth_area')
    .isNumeric()
    .custom(value => {
      if (value <= 0) {
        throw new Error('Plinth area must be greater than 0');
      }
      if (value > 50000) { // 50,000 sq ft limit
        throw new Error('Plinth area cannot exceed 50,000 sq ft');
      }
      return true;
    }),
  
  body('floors')
    .optional()
    .isNumeric()
    .custom(value => {
      if (value <= 0) {
        throw new Error('Number of floors must be greater than 0');
      }
      if (value > 5) {
        throw new Error('Maximum 5 floors allowed');
      }
      // Check if it's a valid half floor (e.g., 1.5, 2.5, etc.)
      const validFloors = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
      if (!validFloors.includes(parseFloat(value))) {
        throw new Error('Invalid floor number. Allowed values: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5');
      }
      return true;
    }),
  
  body('quality')
    .optional()
    .isIn(['basic', 'standard', 'premium', 'luxury'])
    .withMessage('Quality must be one of: basic, standard, premium, luxury'),
  
  body('project_type')
    .optional()
    .isIn(['residential', 'commercial', 'villa', 'renovation'])
    .withMessage('Project type must be one of: residential, commercial, villa, renovation')
];

/**
 * POST /api/calculator/calculate
 * Calculate construction cost and generate timeline
 */
router.post('/calculate', calculateValidation, async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      plinth_area, 
      floors = 1,
      quality = 'standard',
      project_type = 'residential'
    } = req.body;

    logger.info('Cost calculation started', {
      plinthArea: plinth_area,
      floors,
      quality,
      projectType: project_type,
      ip: req.ip
    });

    // Calculate total built-up area
    const totalArea = plinth_area * floors;

    // Calculate cost estimation using total area
    const costEstimation = CostCalculator.calculateCost(totalArea, quality);
    
    // Generate construction timeline based on total area and floors
    const timeline = GanttDataGenerator.generateSpecializedTimeline(project_type, totalArea, floors);

    // Get quality comparison based on total area
    const qualityComparison = CostCalculator.getQualityComparison(totalArea);

    const responseData = {
      costEstimation,
      timeline,
      qualityComparison,
      requestDetails: {
        plinthArea: plinth_area,
        floors: floors,
        totalArea: totalArea,
        quality,
        projectType: project_type,
        calculatedAt: new Date().toISOString()
      }
    };

    const duration = Date.now() - startTime;
    logger.performance('Cost calculation', duration, {
      plinthArea: plinth_area,
      totalArea,
      quality
    });

    res.json({
      success: true,
      message: 'Cost calculation completed successfully',
      data: responseData
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Cost calculation failed', error, {
      duration,
      body: req.body,
      ip: req.ip
    });
    
    throw new AppError('Cost calculation failed', 500);
  }
});

/**
 * GET /api/calculator/quick-estimate/:area
 * Get quick cost estimate for given area
 */
router.get('/quick-estimate/:area', async (req, res) => {
  try {
    const area = parseFloat(req.params.area);
    
    if (isNaN(area) || area <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid area value'
      });
    }

    const quickEstimate = CostCalculator.calculateCost(area, 'standard');
    
    res.json({
      success: true,
      data: {
        area,
        estimatedCost: quickEstimate.totalCost,
        ratePerSqFt: quickEstimate.ratePerSqFt,
        pieChart: quickEstimate.pieChartData,
        currency: 'NPR'
      }
    });

  } catch (error) {
    console.error('Quick estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate quick estimate',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/calculator/phase-cost/:area/:phase
 * Get cost estimation for specific construction phase
 */
router.get('/phase-cost/:area/:phase', async (req, res) => {
  try {
    const { area, phase } = req.params;
    const plinthArea = parseFloat(area);
    
    if (isNaN(plinthArea) || plinthArea <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid area value'
      });
    }

    const phaseCost = CostCalculator.calculatePhaseWiseCost(plinthArea, phase);
    
    res.json({
      success: true,
      data: phaseCost
    });

  } catch (error) {
    console.error('Phase cost calculation error:', error);
    
    if (error.message === 'Invalid construction phase') {
      return res.status(400).json({
        success: false,
        message: 'Invalid construction phase. Valid phases: foundation, structure, roofing, masonry, finishing'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to calculate phase cost',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/calculator/timeline/:area/:type?
 * Get construction timeline only
 */
router.get('/timeline/:area/:type?', async (req, res) => {
  try {
    const { area, type = 'residential' } = req.params;
    const plinthArea = parseFloat(area);
    
    if (isNaN(plinthArea) || plinthArea <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid area value'
      });
    }

    const timeline = GanttDataGenerator.generateSpecializedTimeline(type, plinthArea);
    
    res.json({
      success: true,
      data: timeline
    });

  } catch (error) {
    console.error('Timeline generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate timeline',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/calculator/rates
 * Get current construction rates
 */
router.get('/rates', (req, res) => {
  try {
    const rates = {
      baseRates: {
        basic: 1800,
        standard: 2200,
        premium: 2800,
        luxury: 3500
      },
      lastUpdated: '2024-07-26',
      currency: 'NPR',
      unit: 'per sq ft',
      note: 'Rates may vary based on location, materials, and market conditions'
    };

    res.json({
      success: true,
      data: rates
    });

  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve rates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/calculator/compare-options
 * Compare different construction options
 */
router.post('/compare-options', [
  body('areas').isArray().withMessage('Areas must be an array'),
  body('areas.*').isNumeric().withMessage('Each area must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { areas, quality = 'standard' } = req.body;

    if (areas.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Cannot compare more than 5 options at once'
      });
    }

    const comparisons = areas.map(area => {
      const estimate = CostCalculator.calculateCost(area, quality);
      return {
        area,
        totalCost: estimate.totalCost,
        ratePerSqFt: estimate.ratePerSqFt,
        breakdown: {
          materials: estimate.breakdown.materials.total,
          labor: estimate.breakdown.labor.total,
          other: estimate.breakdown.other.total
        }
      };
    });

    res.json({
      success: true,
      data: {
        quality,
        comparisons,
        currency: 'NPR'
      }
    });

  } catch (error) {
    console.error('Options comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare options',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/calculator/health
 * Health check specifically for calculator service
 */
router.get('/health', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test basic calculation
    const testCalculation = CostCalculator.calculateCost(1000, 'standard');
    const testTimeline = GanttDataGenerator.generateSpecializedTimeline('residential', 1000, 1);
    
    const responseTime = Date.now() - startTime;
    
    res.json({
      success: true,
      service: 'Calculator API',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      capabilities: {
        costCalculation: true,
        timelineGeneration: true,
        qualityComparison: true
      },
      supportedQualities: ['basic', 'standard', 'premium', 'luxury'],
      supportedProjectTypes: ['residential', 'commercial', 'villa', 'renovation']
    });
  } catch (error) {
    logger.error('Calculator health check failed', error);
    res.status(500).json({
      success: false,
      service: 'Calculator API',
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * GET /api/calculator/metrics
 * Get performance metrics and statistics
 */
router.get('/metrics', async (req, res) => {
  try {
    res.json({
      success: true,
      metrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to get metrics', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metrics'
    });
  }
});

module.exports = router;
