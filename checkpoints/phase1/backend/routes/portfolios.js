const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Import the sequelize instance
const { sequelize } = require('../models');

// Portfolio Model
const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectType: {
    type: DataTypes.ENUM('3D Design', 'Construction', '3D Design + Construction', 'Renovation', 'Interior Design'),
    allowNull: false
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  videos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  youtubeUrls: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'portfolios',
  timestamps: true
});

// Sync the model
Portfolio.sync({ alter: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/portfolios');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 20 // Maximum 20 files per upload
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG, GIF) and videos (MP4, MOV, AVI, WMV) are allowed!'));
    }
  }
});

// GET /api/portfolios - Get all portfolios
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch portfolios',
      error: error.message 
    });
  }
});

// GET /api/portfolios/:id - Get single portfolio
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message
    });
  }
});

// POST /api/portfolios - Create new portfolio
router.post('/', upload.fields([
  { name: 'images', maxCount: 15 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description, area, location, projectType, completionDate, youtubeUrls } = req.body;

    // Validation
    if (!title || !description || !area || !location || !projectType) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, area, location, and project type are required'
      });
    }

    // Process uploaded files
    const images = req.files.images ? req.files.images.map(file => file.filename) : [];
    const videos = req.files.videos ? req.files.videos.map(file => file.filename) : [];
    
    // Process YouTube URLs
    let parsedYoutubeUrls = [];
    if (youtubeUrls) {
      try {
        parsedYoutubeUrls = typeof youtubeUrls === 'string' ? JSON.parse(youtubeUrls) : youtubeUrls;
      } catch (error) {
        console.error('Error parsing YouTube URLs:', error);
        parsedYoutubeUrls = [];
      }
    }

    // Create portfolio
    const portfolio = await Portfolio.create({
      title,
      description,
      area,
      location,
      projectType,
      completionDate: completionDate || null,
      images,
      videos,
      youtubeUrls: parsedYoutubeUrls
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully',
      data: portfolio
    });

  } catch (error) {
    console.error('Error creating portfolio:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      const allFiles = [
        ...(req.files.images || []),
        ...(req.files.videos || [])
      ];
      
      allFiles.forEach(file => {
        const filePath = path.join(__dirname, '../public/uploads/portfolios', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create portfolio',
      error: error.message
    });
  }
});

// PUT /api/portfolios/:id - Update portfolio
router.put('/:id', upload.fields([
  { name: 'images', maxCount: 15 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description, area, location, projectType, completionDate, youtubeUrls } = req.body;

    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Process YouTube URLs
    let parsedYoutubeUrls = portfolio.youtubeUrls || [];
    if (youtubeUrls !== undefined) {
      try {
        parsedYoutubeUrls = typeof youtubeUrls === 'string' ? JSON.parse(youtubeUrls) : youtubeUrls;
      } catch (error) {
        console.error('Error parsing YouTube URLs:', error);
        parsedYoutubeUrls = portfolio.youtubeUrls || [];
      }
    }

    // Update basic fields
    const updateData = {
      title: title || portfolio.title,
      description: description || portfolio.description,
      area: area || portfolio.area,
      location: location || portfolio.location,
      projectType: projectType || portfolio.projectType,
      completionDate: completionDate || portfolio.completionDate,
      youtubeUrls: parsedYoutubeUrls
    };

    // Handle new file uploads
    if (req.files) {
      if (req.files.images) {
        const newImages = req.files.images.map(file => file.filename);
        updateData.images = [...(portfolio.images || []), ...newImages];
      }
      
      if (req.files.videos) {
        const newVideos = req.files.videos.map(file => file.filename);
        updateData.videos = [...(portfolio.videos || []), ...newVideos];
      }
    }

    await portfolio.update(updateData);

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio
    });

  } catch (error) {
    console.error('Error updating portfolio:', error);
    
    // Clean up new uploaded files on error
    if (req.files) {
      const allFiles = [
        ...(req.files.images || []),
        ...(req.files.videos || [])
      ];
      
      allFiles.forEach(file => {
        const filePath = path.join(__dirname, '../public/uploads/portfolios', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio',
      error: error.message
    });
  }
});

// DELETE /api/portfolios/:id - Delete portfolio
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Delete associated files
    const allFiles = [...(portfolio.images || []), ...(portfolio.videos || [])];
    allFiles.forEach(filename => {
      const filePath = path.join(__dirname, '../public/uploads/portfolios', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete portfolio from database
    await portfolio.destroy();

    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio',
      error: error.message
    });
  }
});

// DELETE /api/portfolios/:id/media - Delete specific media files
router.delete('/:id/media', async (req, res) => {
  try {
    const { images = [], videos = [] } = req.body;
    
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    let currentImages = portfolio.images || [];
    let currentVideos = portfolio.videos || [];

    // Remove specified images
    images.forEach(filename => {
      const index = currentImages.indexOf(filename);
      if (index > -1) {
        currentImages.splice(index, 1);
        // Delete file from filesystem
        const filePath = path.join(__dirname, '../public/uploads/portfolios', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Remove specified videos
    videos.forEach(filename => {
      const index = currentVideos.indexOf(filename);
      if (index > -1) {
        currentVideos.splice(index, 1);
        // Delete file from filesystem
        const filePath = path.join(__dirname, '../public/uploads/portfolios', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await portfolio.update({
      images: currentImages,
      videos: currentVideos
    });

    res.json({
      success: true,
      message: 'Media files deleted successfully',
      data: portfolio
    });

  } catch (error) {
    console.error('Error deleting media files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media files',
      error: error.message
    });
  }
});

module.exports = router;
