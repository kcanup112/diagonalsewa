const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { Appointment, Service, Admin } = require('../models');

const router = express.Router();

// Simple authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or admin account disabled.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account disabled'
      });
    }

    // Check password
    const isValidPassword = await admin.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Get appointment statistics
    const [
      totalAppointments,
      monthlyAppointments,
      weeklyAppointments,
      pendingAppointments,
      completedAppointments
    ] = await Promise.all([
      Appointment.count(),
      Appointment.count({
        where: {
          createdAt: { [Op.gte]: startOfMonth }
        }
      }),
      Appointment.count({
        where: {
          createdAt: { [Op.gte]: startOfWeek }
        }
      }),
      Appointment.count({
        where: { status: 'pending' }
      }),
      Appointment.count({
        where: { status: 'completed' }
      })
    ]);

    // Get service type distribution
    const serviceDistribution = await Appointment.findAll({
      attributes: [
        'serviceType',
        [require('sequelize').fn('COUNT', require('sequelize').col('serviceType')), 'count']
      ],
      group: ['serviceType']
    });

    // Get recent appointments
    const recentAppointments = await Appointment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'phone', 'email', 'address', 'municipality', 'ward', 'serviceType', 'status', 'appointmentDate', 'message', 'priority', 'createdAt']
    });

    // Get monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const count = await Appointment.count({
        where: {
          createdAt: {
            [Op.between]: [monthStart, monthEnd]
          }
        }
      });

      monthlyTrends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        appointments: count
      });
    }

    res.json({
      success: true,
      data: {
        statistics: {
          totalAppointments,
          monthlyAppointments,
          weeklyAppointments,
          pendingAppointments,
          completedAppointments
        },
        serviceDistribution: serviceDistribution.map(item => ({
          service: item.serviceType,
          count: parseInt(item.dataValues.count)
        })),
        recentAppointments,
        monthlyTrends
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/admin/appointments
 * Get all appointments with filtering and pagination
 */
router.get('/appointments', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      serviceType,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (serviceType) {
      where.serviceType = serviceType;
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (startDate && endDate) {
      where.appointmentDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['name', 'category']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * PUT /api/admin/appointments/:id/status
 * Update appointment status
 */
router.put('/appointments/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update({
      status,
      ...(notes && { message: `${appointment.message || ''}\n\nAdmin Notes: ${notes}` })
    });

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/admin/appointments/:id
 * Get appointment details by ID
 */
router.get('/appointments/:id', authenticateAdmin, async (req, res) => {
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
      message: 'Failed to retrieve appointment details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/admin/export/appointments
 * Export appointments as CSV
 */
router.get('/export/appointments', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate, status, serviceType } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;
    if (startDate && endDate) {
      where.appointmentDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const appointments = await Appointment.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['name', 'category']
        }
      ]
    });

    // Create CSV content
    const csvHeaders = [
      'ID', 'Name', 'Phone', 'Email', 'Address', 'Service Type', 
      'Appointment Date', 'Status', 'Created At', 'Message'
    ];
    
    const csvRows = appointments.map(apt => [
      apt.id,
      apt.name,
      apt.phone,
      apt.email || '',
      apt.address,
      apt.serviceType,
      apt.appointmentDate.toISOString().split('T')[0],
      apt.status,
      apt.createdAt.toISOString().split('T')[0],
      (apt.message || '').replace(/"/g, '""').replace(/\n/g, ' ')
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=appointments-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);

  } catch (error) {
    console.error('Export appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export appointments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/admin/appointments/:id
 * Delete an appointment (soft delete by marking as cancelled)
 */
router.delete('/appointments/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Soft delete by marking as cancelled
    await appointment.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
