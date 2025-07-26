import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaTools, 
  FaUpload, 
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaSpinner,
  FaImage,
  FaTimes
} from 'react-icons/fa';

import { bookingService } from '../services';
import { useApp } from '../context/AppContext';

const RepairMaintenance = () => {
  const { setLoading } = useApp();
  
  const [formData, setFormData] = useState({
    serviceType: 'repair_maintenance', // Default to repair_maintenance
    serviceSubType: '', // Track which specific repair service
    message: '', // Changed from description to message
    appointmentDate: '', // Changed from preferred_date to appointmentDate
    name: '',
    phone: '',
    email: '',
    address: '',
    priority: 'medium' // Changed from urgency to priority
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    { value: 'repair_maintenance', label: 'General Repair & Maintenance', icon: '🔧' },
    { value: 'repair_maintenance', label: 'Plumbing', icon: '🔧' },
    { value: 'repair_maintenance', label: 'Electrical Work', icon: '⚡' },
    { value: 'repair_maintenance', label: 'Painting & Finishing', icon: '🎨' },
    { value: 'repair_maintenance', label: 'Flooring Repair', icon: '🏠' },
    { value: 'repair_maintenance', label: 'Roofing & Waterproofing', icon: '🏠' },
    { value: 'repair_maintenance', label: 'Carpentry Work', icon: '🔨' },
    { value: 'repair_maintenance', label: 'Masonry & Stonework', icon: '🧱' },
    { value: 'repair_maintenance', label: 'HVAC Services', icon: '❄️' },
    { value: 'repair_maintenance', label: 'Other Services', icon: '📋' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', description: 'Can wait 1-2 weeks', color: 'green' },
    { value: 'medium', label: 'Medium', description: 'Within a week', color: 'blue' },
    { value: 'high', label: 'High Priority', description: 'Within 2-3 days', color: 'yellow' },
    { value: 'urgent', label: 'Urgent', description: 'Same day service', color: 'red' }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.serviceSubType) newErrors.serviceType = 'Please select a service type';
    if (!formData.message.trim()) newErrors.message = 'Please describe the issue';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.appointmentDate.trim()) newErrors.appointmentDate = 'Appointment date is required';

    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Date validation
    if (formData.appointmentDate) {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Please select a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid file type. Please upload images or PDF files only.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Please upload files smaller than 5MB.`);
        return false;
      }
      
      return true;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 files
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form fields with correct names for booking API
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('serviceType', formData.serviceType); // Always repair_maintenance
      formDataToSend.append('appointmentDate', formData.appointmentDate);
      
      // Combine service subtype, message, and priority into message field
      let fullMessage = formData.message;
      if (formData.serviceSubType) {
        fullMessage = `Service Type: ${formData.serviceSubType}\n\nDescription: ${formData.message}`;
      }
      fullMessage += `\n\nPriority: ${formData.priority}`;
      
      formDataToSend.append('message', fullMessage);

      // Append files
      files.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await bookingService.createBooking(formDataToSend);

      if (response.success) {
        toast.success('Repair request submitted successfully! We will contact you soon.');
        
        // Reset form
        setFormData({
          serviceType: 'repair_maintenance',
          serviceSubType: '',
          message: '',
          appointmentDate: '',
          name: '',
          phone: '',
          email: '',
          address: '',
          priority: 'medium'
        });
        setFiles([]);
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.errors.forEach(err => {
          backendErrors[err.path || err.param] = err.msg;
        });
        setErrors(backendErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error(error.message || 'Failed to submit request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaTools className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Repair & Maintenance Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional repair and maintenance services for your home or office. 
            Get expert help for all your construction and maintenance needs.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What type of repair service do you need? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {serviceTypes.map((service, index) => (
                  <label
                    key={index}
                    className={`relative flex flex-col items-center cursor-pointer rounded-lg border p-4 text-center transition-all duration-200 ${
                      formData.serviceSubType === service.label
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceSubType"
                      value={service.label}
                      checked={formData.serviceSubType === service.label}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">{service.icon}</span>
                    <span className={`text-sm font-medium ${
                      formData.serviceSubType === service.label ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {service.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.serviceType && (
                <p className="text-red-500 text-sm mt-2">{errors.serviceType}</p>
              )}
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the problem or work needed *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                placeholder="Please provide detailed information about the issue, including location, symptoms, and any relevant details..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Click to upload photos or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF up to 5MB each (Max 3 files)
                    </p>
                  </label>
                </div>

                {/* File Preview */}
                {files.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FaImage className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Urgency Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {urgencyLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all duration-200 ${
                      formData.priority === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={level.value}
                      checked={formData.priority === level.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <div className={`font-medium ${
                        formData.priority === level.value ? `text-${level.color}-900` : 'text-gray-900'
                      }`}>
                        {level.label}
                      </div>
                      <div className={`text-sm ${
                        formData.priority === level.value ? `text-${level.color}-700` : 'text-gray-500'
                      }`}>
                        {level.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={getTomorrowDate()}
                  className={`input-field ${errors.appointmentDate ? 'border-red-500' : ''}`}
                />
                <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.appointmentDate && (
                <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="9812345678"
                    />
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="Property address where service is needed"
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-5 h-5" />
                    <span>Submit Repair Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card text-center">
            <FaPhone className="w-8 h-8 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Emergency Hotline</h3>
            <p className="text-gray-600">Available 24/7 for urgent repairs</p>
            <p className="text-primary-600 font-medium mt-2">+977-123-456789</p>
          </div>

          <div className="card text-center">
            <FaEnvelope className="w-8 h-8 text-secondary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600">Get detailed quotes and estimates</p>
            <p className="text-secondary-600 font-medium mt-2">repairs@constructionco.com</p>
          </div>

          <div className="card text-center">
            <FaCalendar className="w-8 h-8 text-accent-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
            <p className="text-gray-600">We respond within 2-4 hours</p>
            <p className="text-accent-600 font-medium mt-2">Same day service available</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RepairMaintenance;
