import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useRateLimit } from '../hooks/useRateLimit';

const BookingForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    municipality: '',
    serviceType: '3d_design',
    appointmentDate: '',
    message: '',
    // Honeypot fields (hidden from users, bots might fill them)
    website: '',
    url: '',
    bot_field: ''
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Rate limiting hook
  const {
    attempts,
    isLimited,
    nextAllowedTime,
    checkRateLimit,
    recordAttempt,
    checkPhoneLimit,
    getRemainingTime
  } = useRateLimit(3, 60000); // 3 attempts per minute

  const serviceTypes = [
    { value: '3d_design', label: '3D Design & Visualization' },
    { value: 'full_package', label: 'Complete House Construction' },
    { value: 'consultation', label: 'Consultation Service' },
    { value: 'repair_maintenance', label: 'Repair & Maintenance' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size and type
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          images: 'Each image must be smaller than 5MB'
        }));
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          images: 'Only image files are allowed'
        }));
        return false;
      }
      return true;
    });
    
    if (validFiles.length !== files.length) return;
    
    if (validFiles.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 5 images allowed'
      }));
      return;
    }
    
    setImages(validFiles);
    setErrors(prev => ({ ...prev, images: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';

    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Email validation (if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Date validation
    if (formData.appointmentDate) {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.appointmentDate = 'Please select a future date';
      }
    }

    // Check for honeypot fields (bot detection)
    if (formData.website || formData.url || formData.bot_field) {
      newErrors.bot = 'Invalid request detected';
      return newErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side rate limit check
    if (!checkRateLimit()) {
      const remainingTime = Math.ceil(getRemainingTime() / 1000);
      setErrors({
        general: `Too many booking attempts. Please wait ${remainingTime} seconds before trying again.`
      });
      return;
    }

    // Phone-specific rate limit check
    if (!checkPhoneLimit(formData.phone)) {
      setErrors({
        phone: 'This phone number has been used for booking recently. Please wait 24 hours or contact us directly.'
      });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitFormData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitFormData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        submitFormData.append('images', image);
      });

      const response = await fetch('/api/booking', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Record successful attempt
        recordAttempt(formData.phone);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          ward: '',
          municipality: '',
          serviceType: '3d_design',
          appointmentDate: '',
          message: '',
          website: '',
          url: '',
          bot_field: ''
        });
        setImages([]);
        
        if (onSuccess) onSuccess(result);
      } else {
        // Record failed attempt
        recordAttempt(formData.phone);
        
        if (result.errors) {
          const fieldErrors = {};
          result.errors.forEach(error => {
            fieldErrors[error.path || 'general'] = error.msg;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message || 'Booking failed. Please try again.' });
        }
        
        if (onError) onError(result);
      }
    } catch (error) {
      recordAttempt(formData.phone);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
      if (onError) onError({ message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRemainingTime = () => {
    if (!isLimited || !nextAllowedTime) return '';
    
    const remaining = Math.ceil((nextAllowedTime.getTime() - Date.now()) / 1000);
    if (remaining <= 0) return '';
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h2>
        <p className="text-gray-600">Fill out the form below and we'll contact you to confirm your appointment.</p>
      </div>

      {/* Rate limit warning */}
      {isLimited && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
        >
          <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Rate limit exceeded</p>
            <p className="text-red-600 text-sm">
              Please wait {formatRemainingTime()} before submitting another booking request.
            </p>
          </div>
        </motion.div>
      )}

      {/* Attempt counter */}
      {attempts > 0 && attempts < 3 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            Booking attempts: {attempts}/3. Please ensure all information is correct.
          </p>
        </div>
      )}

      {/* General error */}
      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot fields (hidden from users) */}
        <div style={{ display: 'none' }}>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            tabIndex="-1"
            autoComplete="off"
          />
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            tabIndex="-1"
            autoComplete="off"
          />
          <input
            type="text"
            name="bot_field"
            value={formData.bot_field}
            onChange={handleInputChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              maxLength="100"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline w-4 h-4 mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="9800000000"
              maxLength="15"
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline w-4 h-4 mr-1" />
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMapMarkerAlt className="inline w-4 h-4 mr-1" />
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full address"
            maxLength="500"
            required
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward Number
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Ward No. 5"
            />
          </div>

          {/* Municipality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipality
            </label>
            <input
              type="text"
              name="municipality"
              value={formData.municipality}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Lalitpur Metropolitan City"
            />
          </div>
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaCalendar className="inline w-4 h-4 mr-1" />
            Preferred Appointment Date *
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
            }`}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
            required
          />
          {errors.appointmentDate && <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum 5 images, 5MB each. JPG, PNG, or GIF format.
          </p>
          {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          
          {images.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {images.map(img => img.name).join(', ')}
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Any specific requirements or questions..."
            maxLength="1000"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || isLimited}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting || isLimited
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : isLimited ? (
              `Wait ${formatRemainingTime()}`
            ) : (
              'Book Appointment'
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            <FaClock className="inline w-4 h-4 mr-1" />
            We'll contact you within 24 hours to confirm your appointment.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
