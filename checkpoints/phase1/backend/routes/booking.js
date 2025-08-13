const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Appointment, Service } = require('../models');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'repair-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Validation rules
const bookingValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters'),
  
  body('serviceType')
    .isIn(['3d_design', 'full_package', 'consultation', 'repair_maintenance'])
    .withMessage('Invalid service type'),
  
  body('appointmentDate')
    .isISO8601()
    .toDate()
    .custom(value => {
      if (value <= new Date()) {
        throw new Error('Appointment date must be in the future');
      }
      return true;
    }),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
];

/**
 * POST /api/booking
 * Create a new appointment booking
 */
router.post('/', upload.array('images', 5), bookingValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      phone,
      email,
      address,
      ward,
      municipality,
      serviceType,
      appointmentDate,
      message
    } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Create appointment
    const appointment = await Appointment.create({
      name,
      phone,
      email: email || null,
      address,
      ward: ward || null,
      municipality: municipality || null,
      serviceType,
      appointmentDate: new Date(appointmentDate),
      message: message || null,
      images,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will contact you soon.',
      data: {
        appointmentId: appointment.id,
        appointmentDate: appointment.appointmentDate,
        serviceType: appointment.serviceType,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Booking error:', error);

    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create appointment. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/booking/:id
 * Get appointment details by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['name', 'description', 'category']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/booking/check-availability/:date
 * Check appointment availability for a specific date
 */
router.get('/check-availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Parse the date
    const checkDate = new Date(date);
    if (isNaN(checkDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Check if date is in the past
    if (checkDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates'
      });
    }

    // Get start and end of the day
    const startOfDay = new Date(checkDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(checkDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Count appointments for the day
    const appointmentCount = await Appointment.count({
      where: {
        appointmentDate: {
          [require('sequelize').Op.between]: [startOfDay, endOfDay]
        },
        status: {
          [require('sequelize').Op.not]: 'cancelled'
        }
      }
    });

    // Assume max 10 appointments per day
    const maxAppointmentsPerDay = 10;
    const isAvailable = appointmentCount < maxAppointmentsPerDay;

    res.json({
      success: true,
      data: {
        date: checkDate.toISOString().split('T')[0],
        isAvailable,
        bookedSlots: appointmentCount,
        availableSlots: maxAppointmentsPerDay - appointmentCount,
        maxSlots: maxAppointmentsPerDay
      }
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/booking/services
 * Get list of available services
 */
router.get('/services/list', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
