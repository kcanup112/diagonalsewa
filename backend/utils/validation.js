/**
 * Enhanced Request Validation Middleware
 */

const { body, query, param, validationResult } = require('express-validator');
const { ValidationError } = require('./errors');
const logger = require('./logger');

/**
 * Common validation rules
 */
const commonValidations = {
  // Email validation
  email: () => body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  // Phone validation (Nepali format)
  phone: () => body('phone')
    .matches(/^(98|97)\d{8}$/)
    .withMessage('Please provide a valid Nepali phone number (98XXXXXXXX or 97XXXXXXXX)'),

  // Name validation
  name: (field = 'name') => body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage(`${field} must be 2-50 characters long and contain only letters and spaces`),

  // ID validation
  id: (field = 'id') => param(field)
    .isInt({ min: 1 })
    .withMessage(`${field} must be a positive integer`),

  // Date validation
  date: (field = 'date') => body(field)
    .isISO8601()
    .toDate()
    .withMessage(`${field} must be a valid date in ISO format`),

  // Area validation (for construction)
  area: (field = 'plinth_area') => body(field)
    .isFloat({ min: 100, max: 50000 })
    .withMessage(`${field} must be between 100 and 50,000 square feet`),

  // Quality validation
  quality: () => body('quality')
    .optional()
    .isIn(['basic', 'standard', 'premium', 'luxury'])
    .withMessage('Quality must be one of: basic, standard, premium, luxury'),

  // Project type validation
  projectType: () => body('project_type')
    .optional()
    .isIn(['residential', 'commercial', 'villa', 'renovation'])
    .withMessage('Project type must be one of: residential, commercial, villa, renovation'),

  // Floors validation
  floors: () => body('floors')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of floors must be between 1 and 10'),

  // Password validation
  password: () => body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),

  // Message validation
  message: () => body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters')
};

/**
 * Validation sets for different endpoints
 */
const validationSets = {
  // Calculator validation
  calculateCost: [
    commonValidations.area('plinth_area'),
    commonValidations.floors(),
    commonValidations.quality(),
    commonValidations.projectType()
  ],

  // Appointment booking validation
  createAppointment: [
    commonValidations.name('name'),
    commonValidations.email(),
    commonValidations.phone(),
    commonValidations.id('serviceId'),
    commonValidations.date('preferred_date'),
    commonValidations.message()
  ],

  // Update appointment validation
  updateAppointment: [
    commonValidations.id('id'),
    commonValidations.name('name').optional(),
    commonValidations.email().optional(),
    commonValidations.phone().optional(),
    commonValidations.date('preferred_date').optional(),
    body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
      .withMessage('Status must be one of: pending, confirmed, completed, cancelled'),
    commonValidations.message()
  ],

  // Admin login validation
  adminLogin: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters long'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Service creation validation
  createService: [
    commonValidations.name('name'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be 10-500 characters long'),
    body('price_range')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Price range must not exceed 100 characters'),
    body('duration')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Duration must not exceed 50 characters')
  ]
};

/**
 * Middleware to handle validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: errorDetails,
      body: req.body
    });

    throw new ValidationError('Validation failed', errorDetails);
  }
  
  next();
};

/**
 * Create validation middleware for a specific set
 */
const validate = (validationSetName) => {
  const validations = validationSets[validationSetName];
  if (!validations) {
    throw new Error(`Validation set '${validationSetName}' not found`);
  }
  
  return [...validations, handleValidationErrors];
};

module.exports = {
  validate,
  validationSets,
  commonValidations,
  handleValidationErrors
};
