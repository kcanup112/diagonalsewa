const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Op, sequelize } = require('sequelize');
const { sequelize: dbSequelize, Offer } = require('../models');
const { validationResult, body } = require('express-validator');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/offers');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `offer-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Validation middleware
const validateOffer = [
  body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Title must be 3-255 characters'),
  body('offerType').isIn(['discount', 'promotion', 'special_deal', 'seasonal']).withMessage('Invalid offer type'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  body('discountValue').optional().isFloat({ min: 0 }).withMessage('Discount value must be positive'),
  body('priority').optional().isInt({ min: 1, max: 10 }).withMessage('Priority must be between 1-10')
];

// GET /api/admin/offers - Get all offers with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      offerType,
      isActive,
      showAsPopup,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { promoCode: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (offerType) where.offerType = offerType;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (showAsPopup !== undefined) where.showAsPopup = showAsPopup === 'true';

    const { count, rows: offers } = await Offer.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers'
    });
  }
});

// GET /api/admin/offers/active - Get active offers for frontend display
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
        [Op.or]: [
          { usageLimit: null },
          { usageCount: { [Op.lt]: sequelize.col('usageLimit') } }
        ]
      },
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: offers
    });
  } catch (error) {
    logger.error('Error fetching active offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active offers'
    });
  }
});

// GET /api/admin/offers/popups - Get popup offers for frontend
router.get('/popups', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.findAll({
      where: {
        isActive: true,
        showAsPopup: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
        [Op.or]: [
          { usageLimit: null },
          { usageCount: { [Op.lt]: dbSequelize.col('usageLimit') } }
        ]
      },
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
      limit: 3 // Limit to top 3 popup offers
    });

    res.json({
      success: true,
      data: offers
    });
  } catch (error) {
    logger.error('Error fetching popup offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popup offers'
    });
  }
});

// GET /api/admin/offers/:id - Get single offer
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    logger.error('Error fetching offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offer'
    });
  }
});

// POST /api/admin/offers - Create new offer
router.post('/', upload.array('media', 10), validateOffer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const offerData = req.body;
    
    // Process uploaded files
    if (req.files && req.files.length > 0) {
      const images = [];
      const videos = [];

      req.files.forEach(file => {
        const fileUrl = `/uploads/offers/${file.filename}`;
        if (file.mimetype.startsWith('image/')) {
          images.push(fileUrl);
        } else if (file.mimetype.startsWith('video/')) {
          videos.push(fileUrl);
        }
      });

      offerData.images = images;
      offerData.videos = videos;
    }

    // Parse JSON fields
    if (offerData.targetAudience) {
      offerData.targetAudience = JSON.parse(offerData.targetAudience);
    }
    if (offerData.applicableServices) {
      offerData.applicableServices = JSON.parse(offerData.applicableServices);
    }

    const offer = await Offer.create(offerData);

    logger.info('Offer created successfully', { offerId: offer.id, title: offer.title });

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    logger.error('Error creating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create offer'
    });
  }
});

// PUT /api/admin/offers/:id - Update offer
router.put('/:id', upload.array('media', 10), validateOffer, async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const updateData = req.body;
    
    // Process new uploaded files
    if (req.files && req.files.length > 0) {
      const newImages = [];
      const newVideos = [];

      req.files.forEach(file => {
        const fileUrl = `/uploads/offers/${file.filename}`;
        if (file.mimetype.startsWith('image/')) {
          newImages.push(fileUrl);
        } else if (file.mimetype.startsWith('video/')) {
          newVideos.push(fileUrl);
        }
      });

      // Merge with existing media
      updateData.images = [...(offer.images || []), ...newImages];
      updateData.videos = [...(offer.videos || []), ...newVideos];
    }

    // Parse JSON fields
    if (updateData.targetAudience) {
      updateData.targetAudience = JSON.parse(updateData.targetAudience);
    }
    if (updateData.applicableServices) {
      updateData.applicableServices = JSON.parse(updateData.applicableServices);
    }

    await offer.update(updateData);

    logger.info('Offer updated successfully', { offerId: offer.id, title: offer.title });

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    logger.error('Error updating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update offer'
    });
  }
});

// DELETE /api/admin/offers/:id - Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Delete associated media files
    const mediaFiles = [...(offer.images || []), ...(offer.videos || [])];
    for (const mediaUrl of mediaFiles) {
      try {
        const filePath = path.join(__dirname, '../', mediaUrl);
        await fs.unlink(filePath);
      } catch (fileError) {
        logger.warn('Failed to delete media file:', fileError);
      }
    }

    await offer.destroy();

    logger.info('Offer deleted successfully', { offerId: id });

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete offer'
    });
  }
});

// POST /api/admin/offers/:id/toggle - Toggle offer status
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await offer.update({ isActive: !offer.isActive });

    logger.info('Offer status toggled', { offerId: id, newStatus: offer.isActive });

    res.json({
      success: true,
      message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully`,
      data: offer
    });
  } catch (error) {
    logger.error('Error toggling offer status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle offer status'
    });
  }
});

// DELETE /api/admin/offers/:id/media - Remove specific media file
router.delete('/:id/media', async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaUrl, mediaType } = req.body;

    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const mediaArray = mediaType === 'image' ? offer.images : offer.videos;
    const updatedMedia = mediaArray.filter(url => url !== mediaUrl);

    const updateData = {};
    updateData[mediaType === 'image' ? 'images' : 'videos'] = updatedMedia;

    await offer.update(updateData);

    // Delete physical file
    try {
      const filePath = path.join(__dirname, '../', mediaUrl);
      await fs.unlink(filePath);
    } catch (fileError) {
      logger.warn('Failed to delete media file:', fileError);
    }

    res.json({
      success: true,
      message: 'Media file removed successfully'
    });
  } catch (error) {
    logger.error('Error removing media file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove media file'
    });
  }
});

module.exports = router;
