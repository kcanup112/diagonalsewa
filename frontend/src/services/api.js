import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Success:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        data: response.data
      });
    }
    return response.data;
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Only redirect to admin login if we're not already there
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.warn('⚠️ Rate limit exceeded, please wait before trying again');
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('🚨 Server error detected, please try again later');
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// Booking Services
export const bookingService = {
  submit: (data) => api.post('/booking', data),
  getAll: () => api.get('/booking'),
  getById: (id) => api.get(`/booking/${id}`),
  update: (id, data) => api.put(`/booking/${id}`, data),
  delete: (id) => api.delete(`/booking/${id}`)
};

// Repair Services
export const repairService = {
  submitRequest: (data) => api.post('/repair', data),
  getAll: () => api.get('/repair'),
  getById: (id) => api.get(`/repair/${id}`),
  update: (id, data) => api.put(`/repair/${id}`, data),
  delete: (id) => api.delete(`/repair/${id}`)
};

// Contact Services
export const contactService = {
  submitContact: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  getById: (id) => api.get(`/contact/${id}`),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`)
};

// Admin Services
export const adminService = {
  login: (credentials) => api.post('/admin/login', credentials),
  getDashboardData: () => api.get('/admin/dashboard'),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getRepairs: (params) => api.get('/admin/repairs', { params }),
  getContacts: (params) => api.get('/admin/contacts', { params }),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  updateRepairStatus: (id, status) => api.put(`/admin/repairs/${id}/status`, { status })
};

export default api;
