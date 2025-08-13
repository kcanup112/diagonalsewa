const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { TeamMember, Admin } = require('../models');

// Authentication middleware
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/team');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/team
// @desc    Get all active team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
});

// @route   GET /api/team/admin
// @desc    Get all team members (including inactive) for admin
// @access  Private (Admin only)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({
      order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });
  } catch (error) {
    console.error('Error fetching team members for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
});

// @route   GET /api/team/:id
// @desc    Get single team member
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member',
      error: error.message
    });
  }
});

// @route   POST /api/team
// @desc    Create new team member
// @access  Private (Admin only)
router.post('/', authenticateAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      position,
      experience,
      overview,
      qualifications,
      workDescription,
      email,
      displayOrder
    } = req.body;

    // Parse qualifications if it's a string
    let parsedQualifications = [];
    if (qualifications) {
      try {
        parsedQualifications = typeof qualifications === 'string' 
          ? JSON.parse(qualifications) 
          : qualifications;
      } catch (e) {
        parsedQualifications = [];
      }
    }

    const teamMemberData = {
      name,
      position,
      experience,
      overview,
      qualifications: parsedQualifications,
      workDescription,
      email,
      displayOrder: displayOrder || 0
    };

    // Add profile image if uploaded
    if (req.file) {
      teamMemberData.profileImage = `/uploads/team/${req.file.filename}`;
    }

    const teamMember = await TeamMember.create(teamMemberData);

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/team', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(400).json({
      success: false,
      message: 'Failed to create team member',
      error: error.message
    });
  }
});

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const {
      name,
      position,
      experience,
      overview,
      qualifications,
      workDescription,
      email,
      isActive,
      displayOrder
    } = req.body;

    // Parse qualifications if it's a string
    let parsedQualifications = teamMember.qualifications;
    if (qualifications !== undefined) {
      try {
        parsedQualifications = typeof qualifications === 'string' 
          ? JSON.parse(qualifications) 
          : qualifications;
      } catch (e) {
        parsedQualifications = teamMember.qualifications;
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (experience !== undefined) updateData.experience = experience;
    if (overview !== undefined) updateData.overview = overview;
    if (qualifications !== undefined) updateData.qualifications = parsedQualifications;
    if (workDescription !== undefined) updateData.workDescription = workDescription;
    if (email !== undefined) updateData.email = email;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    // Handle profile image update
    if (req.file) {
      // Delete old image if it exists
      if (teamMember.profileImage) {
        const oldImagePath = path.join(__dirname, '..', teamMember.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.profileImage = `/uploads/team/${req.file.filename}`;
    }

    await teamMember.update(updateData);

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/team', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(400).json({
      success: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Delete profile image if it exists
    if (teamMember.profileImage) {
      const imagePath = path.join(__dirname, '..', teamMember.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await teamMember.destroy();

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
      error: error.message
    });
  }
});

// @route   PUT /api/team/:id/toggle-status
// @desc    Toggle team member active status
// @access  Private (Admin only)
router.put('/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await teamMember.update({ isActive: !teamMember.isActive });

    res.json({
      success: true,
      message: `Team member ${teamMember.isActive ? 'activated' : 'deactivated'} successfully`,
      data: teamMember
    });
  } catch (error) {
    console.error('Error toggling team member status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle team member status',
      error: error.message
    });
  }
});

// @route   PUT /api/team/reorder
// @desc    Reorder team members
// @access  Private (Admin only)
router.put('/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { teamMembers } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(teamMembers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected array of team members.'
      });
    }

    // Update display orders
    const updatePromises = teamMembers.map(({ id, displayOrder }) =>
      TeamMember.update({ displayOrder }, { where: { id } })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Team members reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder team members',
      error: error.message
    });
  }
});

module.exports = router;
