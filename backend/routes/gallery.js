const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');
const { Gallery } = require('../models');

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
    req.admin = decoded;
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
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/gallery');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slideshow-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (increased from 5MB)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400));
    }
  }
});

// In-memory storage for different gallery types
// In production, this should be stored in a database
let slideshowImages = [
  {
    id: 1,
    url: '/images/gallery/living.jpg',
    title: 'Quality Construction',
    description: 'Building with precision and care',
    alt: 'Living room construction showcase',
    position: 0,
    type: 'slideshow',
    category: 'Interior',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    url: '/images/gallery/white.jpg',
    title: 'Expert Craftsmanship',
    description: 'Professional results you can trust',
    alt: 'White interior design showcase',
    position: 1,
    type: 'slideshow',
    category: 'Interior',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    url: '/images/gallery/hero.jpg',
    title: 'Professional Design',
    description: 'Modern architectural excellence',
    alt: 'Hero construction project showcase',
    position: 2,
    type: 'slideshow',
    category: 'Construction',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    url: '/images/gallery/4.jpg',
    title: 'Quality Interiors',
    description: 'Elegant and functional living spaces',
    alt: 'Interior design showcase',
    position: 3,
    type: 'slideshow',
    category: 'Interior',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    url: '/images/gallery/repair.jpg',
    title: 'Expert Repairs',
    description: 'Professional maintenance and repair services',
    alt: 'Repair and maintenance showcase',
    position: 4,
    type: 'slideshow',
    category: 'Maintenance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// General gallery storage for gallery page
let galleryImages = [
  {
    id: 101,
    url: '/images/gallery/LIVING (2).jpg',
    title: 'Contemporary Living Space',
    description: 'Modern living room with contemporary furniture and lighting',
    alt: 'Contemporary living room showcase',
    position: 0,
    type: 'gallery',
    category: 'Interior',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    url: '/images/gallery/LIVING 2.jpg',
    title: 'Elegant Living Area',
    description: 'Sophisticated living area with premium finishes',
    alt: 'Elegant living area showcase',
    position: 1,
    type: 'gallery',
    category: 'Interior',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 103,
    url: '/images/gallery/HIRAKAJI DINING.jpg',
    title: 'Dining Room Design',
    description: 'Beautiful dining room with custom furniture',
    alt: 'Dining room design showcase',
    position: 2,
    type: 'gallery',
    category: 'Interior',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 104,
    url: '/images/gallery/STAIR.jpg',
    title: 'Modern Staircase',
    description: 'Contemporary staircase design with glass railings',
    alt: 'Modern staircase showcase',
    position: 3,
    type: 'gallery',
    category: 'Interior',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 105,
    url: '/images/gallery/hero.jpg',
    title: 'Construction Project',
    description: 'Complete construction project from foundation to finish',
    alt: 'Construction project showcase',
    position: 4,
    type: 'gallery',
    category: 'Construction',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 106,
    url: '/images/gallery/repair.jpg',
    title: 'Maintenance Services',
    description: 'Professional maintenance and repair work',
    alt: 'Maintenance services showcase',
    position: 5,
    type: 'gallery',
    category: 'Maintenance',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper functions
const getNextId = (type = 'slideshow') => {
  const images = type === 'slideshow' ? slideshowImages : galleryImages;
  return images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : (type === 'slideshow' ? 1 : 101);
};

const getImagesArray = (type) => {
  return type === 'slideshow' ? slideshowImages : galleryImages;
};

const setImagesArray = (type, newArray) => {
  if (type === 'slideshow') {
    slideshowImages = newArray;
  } else {
    galleryImages = newArray;
  }
};

/**
 * @route GET /api/gallery/slideshow
 * @desc Get all slideshow images
 * @access Public
 */
router.get('/slideshow', async (req, res, next) => {
  try {
    logger.info('📸 Fetching slideshow images');
    
    // Fetch slideshow images from database
    const sortedImages = await Gallery.findAll({
      where: { type: 'slideshow' },
      order: [['position', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Slideshow images retrieved successfully',
      data: sortedImages,
      count: sortedImages.length
    });

    logger.info(`✅ Retrieved ${sortedImages.length} slideshow images`);
  } catch (error) {
    logger.error('❌ Error fetching slideshow images:', error);
    next(error);
  }
});

/**
 * @route GET /api/gallery/images
 * @desc Get all gallery images
 * @access Public
 */
router.get('/images', async (req, res, next) => {
  try {
    logger.info('🖼️ Fetching all gallery images');
    
    const { type, limit, offset } = req.query;
    
    // Build query conditions
    const where = {};
    if (type) where.type = type;

    // Build query options
    const options = {
      where,
      order: [['position', 'ASC']]
    };

    if (limit) {
      options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);
    }

    // Fetch from database
    const { count, rows: filteredImages } = await Gallery.findAndCountAll(options);

    res.json({
      success: true,
      message: 'Gallery images retrieved successfully',
      data: filteredImages,
      count: filteredImages.length,
      total: count
    });

    logger.info(`✅ Retrieved ${filteredImages.length} gallery images`);
  } catch (error) {
    logger.error('❌ Error fetching gallery images:', error);
    next(error);
  }
});

/**
 * @route POST /api/gallery/upload
 * @desc Upload new gallery image
 * @access Private (Admin)
 */
router.post('/upload', authenticateAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum file size is 10MB.',
            error: 'FILE_TOO_LARGE'
          });
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected field name. Please use "image" field.',
            error: 'INVALID_FIELD_NAME'
          });
        } else {
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
            error: err.code
          });
        }
      }
      // Handle other errors
      return res.status(400).json({
        success: false,
        message: err.message || 'Upload failed',
        error: 'UPLOAD_ERROR'
      });
    }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    const { title, description, alt, position, type } = req.body;

    if (!title || !description || !alt) {
      return next(new AppError('Title, description, and alt text are required', 400));
    }

    // Generate URL for uploaded file
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    // Calculate next position
    let nextPosition = parseInt(position) || 0;
    if (!position) {
      const maxPosition = await Gallery.max('position', {
        where: { type: type || 'slideshow' }
      });
      nextPosition = (maxPosition || 0) + 1;
    }

    // Create new image in database
    const newImage = await Gallery.create({
      url: imageUrl,
      title: title.trim(),
      description: description.trim(),
      alt: alt.trim(),
      position: nextPosition,
      type: type || 'slideshow',
      category: 'Interior', // Default category for slideshow
      featured: false
    });

    logger.info(`✅ Uploaded new gallery image: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: newImage
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    logger.error('❌ Error uploading gallery image:', error);
    next(error);
  }
});

/**
 * @route PUT /api/gallery/images/:id
 * @desc Update gallery image details
 * @access Private (Admin)
 */
router.put('/images/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);
    const { title, description, alt, position } = req.body;

    // Find image in database
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return next(new AppError('Image not found', 404));
    }

    // Update image details
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (alt) updateData.alt = alt.trim();
    if (position !== undefined) updateData.position = parseInt(position);

    await image.update(updateData);

    logger.info(`✅ Updated gallery image: ${image.title}`);

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: image
    });

  } catch (error) {
    logger.error('❌ Error updating gallery image:', error);
    next(error);
  }
});

/**
 * @route PUT /api/gallery/images/:id/position
 * @desc Update image position/order
 * @access Private (Admin)
 */
router.put('/images/:id/position', authenticateAdmin, async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);
    const { position } = req.body;

    if (position === undefined || position < 0) {
      return next(new AppError('Valid position is required', 400));
    }

    // Find image in database
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return next(new AppError('Image not found', 404));
    }

    const newPosition = parseInt(position);
    await image.update({ position: newPosition });

    logger.info(`✅ Updated image position: ID ${imageId} to position ${newPosition}`);

    res.json({
      success: true,
      message: 'Image position updated successfully',
      data: image
    });

  } catch (error) {
    logger.error('❌ Error updating image position:', error);
    next(error);
  }
});

/**
 * @route DELETE /api/gallery/images/:id
 * @desc Delete gallery image
 * @access Private (Admin)
 */
router.delete('/images/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);

    // Find image in database
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return next(new AppError('Image not found', 404));
    }

    // Delete the physical file if it's an uploaded file
    if (image.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../', image.url);
      try {
        await fs.unlink(filePath);
        logger.info(`🗑️ Deleted file: ${filePath}`);
      } catch (fileError) {
        logger.warn('File deletion error (file may not exist):', fileError.message);
      }
    }

    const deletedTitle = image.title;
    await image.destroy();

    logger.info(`✅ Deleted gallery image: ${deletedTitle}`);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: { id: imageId }
    });

  } catch (error) {
    logger.error('❌ Error deleting gallery image:', error);
    next(error);
  }
});

// ===== GENERAL GALLERY PAGE ROUTES =====

/**
 * @route GET /api/gallery/photos
 * @desc Get all gallery photos (for gallery page)
 * @access Public
 */
router.get('/photos', async (req, res, next) => {
  try {
    logger.info('🖼️ Fetching gallery photos');
    
    const { category, featured, limit, offset } = req.query;
    
    // Build query conditions
    const where = { type: 'gallery' };
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }

    // Pagination options
    const options = {
      where,
      order: [['position', 'ASC'], ['createdAt', 'DESC']],
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    };

    // Fetch from database
    const { count, rows: filteredImages } = await Gallery.findAndCountAll(options);

    res.json({
      success: true,
      message: 'Gallery photos retrieved successfully',
      data: filteredImages,
      count: filteredImages.length,
      total: count
    });

    logger.info(`✅ Retrieved ${filteredImages.length} gallery photos`);
  } catch (error) {
    logger.error('❌ Error fetching gallery photos:', error);
    next(error);
  }
});

/**
 * @route GET /api/gallery/categories
 * @desc Get all gallery categories
 * @access Public
 */
router.get('/categories', async (req, res, next) => {
  try {
    logger.info('📂 Fetching gallery categories');
    
    // Return predefined categories (matches Gallery model enum)
    const categories = ['Interior', 'Exterior', 'Commercial', 'Residential', 'Other'];
    
    res.json({
      success: true,
      message: 'Gallery categories retrieved successfully',
      data: categories
    });

    logger.info(`✅ Retrieved ${categories.length} categories`);
  } catch (error) {
    logger.error('❌ Error fetching categories:', error);
    next(error);
  }
});

/**
 * @route POST /api/gallery/photos/upload
 * @desc Upload new gallery photo
 * @access Private (Admin)
 */
router.post('/photos/upload', authenticateAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum file size is 10MB.',
            error: 'FILE_TOO_LARGE'
          });
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected field name. Please use "image" field.',
            error: 'INVALID_FIELD_NAME'
          });
        } else {
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
            error: err.code
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Upload failed',
        error: 'UPLOAD_ERROR'
      });
    }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    const { title, description, alt, category, featured, position } = req.body;

    if (!title || !description || !alt || !category) {
      return next(new AppError('Title, description, alt text, and category are required', 400));
    }

    // Generate URL for uploaded file
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    // Get the next position if not provided
    let nextPosition = parseInt(position) || 0;
    if (!position) {
      const maxPosition = await Gallery.max('position', {
        where: { type: 'gallery', category }
      });
      nextPosition = (maxPosition || 0) + 1;
    }

    // Create gallery entry in database
    const newImage = await Gallery.create({
      url: imageUrl,
      title: title.trim(),
      description: description.trim(),
      alt: alt.trim(),
      category: category.trim(),
      featured: featured === 'true',
      position: nextPosition,
      type: 'gallery'
    });

    logger.info(`✅ Uploaded new gallery photo: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Gallery photo uploaded successfully',
      data: newImage
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    logger.error('❌ Error uploading gallery photo:', error);
    next(error);
  }
});

/**
 * @route PUT /api/gallery/photos/:id
 * @desc Update gallery photo details
 * @access Private (Admin)
 */
router.put('/photos/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);
    const { title, description, alt, category, featured, position } = req.body;

    // Find image in database
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return next(new AppError('Gallery photo not found', 404));
    }

    // Update image details
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (alt) updateData.alt = alt.trim();
    if (category) updateData.category = category.trim();
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
    if (position !== undefined) updateData.position = parseInt(position);

    await image.update(updateData);

    logger.info(`✅ Updated gallery photo: ${image.title}`);

    res.json({
      success: true,
      message: 'Gallery photo updated successfully',
      data: image
    });

  } catch (error) {
    logger.error('❌ Error updating gallery photo:', error);
    next(error);
  }
});

/**
 * @route PUT /api/gallery/photos/:id/position
 * @desc Update gallery photo position/order
 * @access Private (Admin)
 */
router.put('/photos/:id/position', authenticateAdmin, async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);
    const { position } = req.body;

    if (position === undefined || position < 0) {
      return next(new AppError('Valid position is required', 400));
    }

    // Find image in database
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return next(new AppError('Gallery photo not found', 404));
    }

    const newPosition = parseInt(position);
    await image.update({ position: newPosition });

    logger.info(`✅ Updated gallery photo position: ID ${imageId} to position ${newPosition}`);

    res.json({
      success: true,
      message: 'Gallery photo position updated successfully',
      data: image
    });

  } catch (error) {
    logger.error('❌ Error updating gallery photo position:', error);
    next(error);
  }
});

/**
 * @route DELETE /api/gallery/photos/:id
 * @desc Delete gallery photo
 * @access Private (Admin)
 */
router.delete('/photos/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);

    // Find image in database
    const image = await Gallery.findByPk(imageId);
    if (!image) {
      return next(new AppError('Gallery photo not found', 404));
    }

    // Delete the physical file if it's an uploaded file
    if (image.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../', image.url);
      try {
        await fs.unlink(filePath);
        logger.info(`🗑️ Deleted file: ${filePath}`);
      } catch (fileError) {
        logger.warn('File deletion error (file may not exist):', fileError.message);
      }
    }

    const deletedTitle = image.title;
    await image.destroy();

    logger.info(`✅ Deleted gallery photo: ${deletedTitle}`);

    res.json({
      success: true,
      message: 'Gallery photo deleted successfully',
      data: { id: imageId }
    });

  } catch (error) {
    logger.error('❌ Error deleting gallery photo:', error);
    next(error);
  }
});

module.exports = router;
