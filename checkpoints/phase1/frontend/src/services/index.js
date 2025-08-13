import api from './api';

/**
 * Booking Service
 * Handles all booking-related API calls
 */
export const bookingService = {
  /**
   * Create a new appointment booking
   * @param {FormData} formData - Form data including images
   * @returns {Promise} API response
   */
  createBooking: async (formData) => {
    try {
      const response = await api.post('/booking', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get appointment details by ID
   * @param {string} id - Appointment ID
   * @returns {Promise} API response
   */
  getAppointment: async (id) => {
    try {
      const response = await api.get(`/booking/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Check appointment availability for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} API response
   */
  checkAvailability: async (date) => {
    try {
      const response = await api.get(`/booking/check-availability/${date}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get list of available services
   * @returns {Promise} API response
   */
  getServices: async () => {
    try {
      const response = await api.get('/booking/services/list');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

/**
 * Calculator Service
 * Handles cost calculation and timeline generation
 */
export const calculatorService = {
  /**
   * Calculate construction cost and generate timeline
   * @param {Object} data - Calculation parameters
   * @returns {Promise} API response
   */
  calculateCost: async (data) => {
    try {
      console.log('🚀 Frontend: Sending calculation request:', data);
      const response = await api.post('/calculator/calculate', data);
      console.log('✅ Frontend: Received calculation response:', response);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      console.error('❌ Frontend: Calculation error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get quick cost estimate
   * @param {number} area - Plinth area in sq ft
   * @returns {Promise} API response
   */
  getQuickEstimate: async (area) => {
    try {
      const response = await api.get(`/calculator/quick-estimate/${area}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get phase-wise cost estimation
   * @param {number} area - Plinth area in sq ft
   * @param {string} phase - Construction phase
   * @returns {Promise} API response
   */
  getPhaseCost: async (area, phase) => {
    try {
      const response = await api.get(`/calculator/phase-cost/${area}/${phase}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get construction timeline
   * @param {number} area - Plinth area in sq ft
   * @param {string} type - Project type (optional)
   * @returns {Promise} API response
   */
  getTimeline: async (area, type = 'residential') => {
    try {
      const response = await api.get(`/calculator/timeline/${area}/${type}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get current construction rates
   * @returns {Promise} API response
   */
  getRates: async () => {
    try {
      const response = await api.get('/calculator/rates');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Compare different construction options
   * @param {Object} data - Comparison parameters
   * @returns {Promise} API response
   */
  compareOptions: async (data) => {
    try {
      const response = await api.post('/calculator/compare-options', data);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

/**
 * Admin Service
 * Handles admin authentication and dashboard operations
 */
export const adminService = {
  /**
   * Admin login
   * @param {Object} credentials - Username and password
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get dashboard statistics
   * @returns {Promise} API response
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all appointments with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAppointments: async (params = {}) => {
    try {
      const response = await api.get('/admin/appointments', { params });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get appointment details by ID
   * @param {string} id - Appointment ID
   * @returns {Promise} API response
   */
  getAppointment: async (id) => {
    try {
      const response = await api.get(`/booking/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update appointment status
   * @param {string} id - Appointment ID
   * @param {Object} data - Status update data
   * @returns {Promise} API response
   */
  updateAppointmentStatus: async (id, data) => {
    try {
      const response = await api.put(`/admin/appointments/${id}/status`, data);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export appointments as CSV
   * @param {Object} params - Export parameters
   * @returns {Promise} API response
   */
  exportAppointments: async (params = {}) => {
    try {
      const response = await api.get('/admin/export/appointments', {
        params,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete an appointment
   * @param {string} id - Appointment ID
   * @returns {Promise} API response
   */
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/admin/appointments/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

/**
 * Repair Service
 * Handles repair and maintenance requests
 */
export const repairService = {
  /**
   * Submit a repair request
   * @param {FormData} formData - Form data including images
   * @returns {Promise} API response
   */
  submitRequest: async (formData) => {
    try {
      const response = await api.post('/repair', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all repair requests (Admin only)
   * @returns {Promise} API response
   */
  getAll: async () => {
    try {
      const response = await api.get('/repair');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get repair request by ID
   * @param {string} id - Repair request ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/repair/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update repair request status (Admin only)
   * @param {string} id - Repair request ID
   * @param {Object} data - Update data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/repair/${id}`, data);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete repair request (Admin only)
   * @param {string} id - Repair request ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/repair/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

/**
 * Contact Service
 * Handles contact form submissions
 */
export const contactService = {
  /**
   * Submit contact form
   * @param {Object} data - Contact form data
   * @returns {Promise} API response
   */
  submitContact: async (data) => {
    try {
      const response = await api.post('/contact', data);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all contact messages (Admin only)
   * @returns {Promise} API response
   */
  getAll: async () => {
    try {
      const response = await api.get('/contact');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get contact message by ID
   * @param {string} id - Contact message ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/contact/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Mark contact as read (Admin only)
   * @param {string} id - Contact message ID
   * @returns {Promise} API response
   */
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/contact/${id}/read`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete contact message (Admin only)
   * @param {string} id - Contact message ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/contact/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

/**
 * Gallery Service
 * Handles gallery and slideshow content management
 */
export const galleryService = {
  /**
   * Get slideshow images for homepage
   * @returns {Promise} API response
   */
  getSlideshowImages: async () => {
    try {
      const response = await api.get('/gallery/slideshow');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      console.warn('Failed to load slideshow images from backend, using fallback');
      // Fallback to default images if backend is unavailable
      return {
        success: true,
        data: [
          { 
            id: 1, 
            url: '/images/gallery/living.jpg', 
            title: 'Quality Construction',
            description: 'Building with precision and care',
            alt: 'Living room construction showcase'
          },
          { 
            id: 2, 
            url: '/images/gallery/white.jpg', 
            title: 'Expert Craftsmanship',
            description: 'Professional results you can trust',
            alt: 'White interior design showcase'
          },
          { 
            id: 3, 
            url: '/images/gallery/hero.jpg', 
            title: 'Professional Design',
            description: 'Modern architectural excellence',
            alt: 'Hero construction project showcase'
          },
          { 
            id: 4, 
            url: '/images/gallery/4.jpg', 
            title: 'Quality Interiors',
            description: 'Elegant and functional living spaces',
            alt: 'Interior design showcase'
          },
          { 
            id: 5, 
            url: '/images/gallery/repair.jpg', 
            title: 'Expert Repairs',
            description: 'Professional maintenance and repair services',
            alt: 'Repair and maintenance showcase'
          }
        ]
      };
    }
  },

  /**
   * Get all gallery images with categories
   * @returns {Promise} API response
   */
  getAllImages: async () => {
    try {
      const response = await api.get('/gallery/images');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Upload new gallery image (Admin only)
   * @param {FormData} formData - Form data including image
   * @returns {Promise} API response
   */
  uploadImage: async (formData) => {
    try {
      const response = await api.post('/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update gallery image details (Admin only)
   * @param {string} id - Image ID
   * @param {Object} data - Updated image data
   * @returns {Promise} API response
   */
  updateImage: async (id, data) => {
    try {
      const response = await api.put(`/gallery/images/${id}`, data);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update image position/order (Admin only)
   * @param {string} id - Image ID
   * @param {number} position - New position
   * @returns {Promise} API response
   */
  updateImagePosition: async (id, position) => {
    try {
      const response = await api.put(`/gallery/images/${id}/position`, { position });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete gallery image (Admin only)
   * @param {string} id - Image ID
   * @returns {Promise} API response
   */
  deleteImage: async (id) => {
    try {
      const response = await api.delete(`/gallery/images/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ===== GENERAL GALLERY PAGE METHODS =====

  /**
   * Get gallery photos for gallery page
   * @param {Object} params - Query parameters {category, featured, limit, offset}
   * @returns {Promise} API response
   */
  getGalleryPhotos: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.featured !== undefined) queryParams.append('featured', params.featured);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);

      const response = await api.get(`/gallery/photos?${queryParams.toString()}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      console.warn('Failed to load gallery photos from backend, using fallback');
      // Fallback to default images if backend is unavailable
      return {
        success: true,
        data: [
          { 
            id: 101, 
            url: '/images/gallery/LIVING (2).jpg', 
            title: 'Contemporary Living Space',
            description: 'Modern living room with contemporary furniture and lighting',
            alt: 'Contemporary living room showcase',
            category: 'Interior',
            featured: true
          },
          { 
            id: 102, 
            url: '/images/gallery/LIVING 2.jpg', 
            title: 'Elegant Living Area',
            description: 'Sophisticated living area with premium finishes',
            alt: 'Elegant living area showcase',
            category: 'Interior',
            featured: false
          },
          { 
            id: 103, 
            url: '/images/gallery/HIRAKAJI DINING.jpg', 
            title: 'Dining Room Design',
            description: 'Beautiful dining room with custom furniture',
            alt: 'Dining room design showcase',
            category: 'Interior',
            featured: true
          },
          { 
            id: 104, 
            url: '/images/gallery/STAIR.jpg', 
            title: 'Modern Staircase',
            description: 'Contemporary staircase design with glass railings',
            alt: 'Modern staircase showcase',
            category: 'Interior',
            featured: false
          },
          { 
            id: 105, 
            url: '/images/gallery/hero.jpg', 
            title: 'Construction Project',
            description: 'Complete construction project from foundation to finish',
            alt: 'Construction project showcase',
            category: 'Construction',
            featured: true
          },
          { 
            id: 106, 
            url: '/images/gallery/repair.jpg', 
            title: 'Maintenance Services',
            description: 'Professional maintenance and repair work',
            alt: 'Maintenance services showcase',
            category: 'Maintenance',
            featured: false
          }
        ]
      };
    }
  },

  /**
   * Get gallery categories
   * @returns {Promise} API response
   */
  getGalleryCategories: async () => {
    try {
      const response = await api.get('/gallery/categories');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      console.warn('Failed to load categories from backend, using fallback');
      // Fallback to default categories
      return {
        success: true,
        data: ['Interior', 'Construction', 'Maintenance']
      };
    }
  },

  /**
   * Upload new gallery photo (Admin only)
   * @param {FormData} formData - Form data including image and metadata
   * @returns {Promise} API response
   */
  uploadGalleryPhoto: async (formData) => {
    try {
      const response = await api.post('/gallery/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update gallery photo details (Admin only)
   * @param {string} id - Photo ID
   * @param {Object} data - Updated photo data
   * @returns {Promise} API response
   */
  updateGalleryPhoto: async (id, data) => {
    try {
      const response = await api.put(`/gallery/photos/${id}`, data);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update gallery photo position/order (Admin only)
   * @param {string} id - Photo ID
   * @param {number} position - New position
   * @returns {Promise} API response
   */
  updateGalleryPhotoPosition: async (id, position) => {
    try {
      const response = await api.put(`/gallery/photos/${id}/position`, { position });
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete gallery photo (Admin only)
   * @param {string} id - Photo ID
   * @returns {Promise} API response
   */
  deleteGalleryPhoto: async (id) => {
    try {
      const response = await api.delete(`/gallery/photos/${id}`);
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

/**
 * General API service
 */
export const apiService = {
  /**
   * Health check endpoint
   * @returns {Promise} API response
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response; // response is already response.data due to interceptor
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
