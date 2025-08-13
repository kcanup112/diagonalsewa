import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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

// Custom styles for React DatePicker
const customDatePickerStyle = `
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container {
    width: 100%;
  }
  
  .react-datepicker {
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .react-datepicker__header {
    background-color: #4265d6;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  .react-datepicker__current-month {
    color: white;
    font-weight: 600;
  }
  
  .react-datepicker__day-name {
    color: white;
    font-weight: 500;
  }
  
  .react-datepicker__day--selected {
    background-color: #4265d6;
    color: white;
  }
  
  .react-datepicker__day:hover {
    background-color: #c2e7c9;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = customDatePickerStyle;
  document.head.appendChild(styleSheet);
}

const RepairMaintenance = () => {
  const { setLoading } = useApp();
  
  const [formData, setFormData] = useState({
    serviceType: 'repair_maintenance', // Default to repair_maintenance
    serviceSubType: '', // Track which specific repair service
    message: '', // Changed from description to message
    appointmentDate: null, // Changed to use Date object for React DatePicker
    name: '',
    phone: '',
    email: '',
    address: '',
    priority: 'medium' // Changed from urgency to priority
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);

  const serviceTypes = [
    { 
      value: 'repair_maintenance', 
      label: 'General Repair & Maintenance', 
      icon: '🔧',
      tooltip: {
        title: 'General Repair & Maintenance',
        points: [
          'Minor fixes and repairs',
          'Property touch-ups',
          'General upkeep services',
          'Maintenance checks',
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Plumbing', 
      icon: '🚰',
      tooltip: {
        title: 'Plumbing Services',
        points: [
          'Pipe repairs and replacements',
          'Leak detection and fixes',
          'Faucet installation',
          'Drainage system maintenance',
          'Water system repairs'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Electrical Work', 
      icon: '⚡',
      tooltip: {
        title: 'Electrical Services',
        points: [
          'Wiring repairs and upgrades',
          'Outlet and switch installation',
          'Lighting fixture setup',
          'Electrical troubleshooting',
          'Safety inspections'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Painting & Finishing', 
      icon: '🎨',
      tooltip: {
        title: 'Painting & Finishing',
        points: [
          'Interior wall painting',
          'Exterior house painting',
          'Wall finishing work',
          'Texture applications',
          'Surface preparation'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Flooring Repair', 
      icon: '🏠',
      tooltip: {
        title: 'Flooring Services',
        points: [
          'Tile replacement and repair',
          'Wood floor restoration',
          'Carpet fixes and cleaning',
          'Flooring installation',
          'Floor leveling'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Roofing & Waterproofing', 
      icon: '🏘️',
      tooltip: {
        title: 'Roofing & Waterproofing',
        points: [
          'Roof leak repairs',
          'Waterproofing solutions',
          'Gutter maintenance',
          'Weather protection',
          'Roof inspections'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Carpentry Work', 
      icon: '🔨',
      tooltip: {
        title: 'Carpentry Services',
        points: [
          'Door and window repairs',
          'Cabinet installation',
          'Furniture fixes',
          'Custom woodwork',
          'Structural repairs'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Masonry & Stonework', 
      icon: '🧱',
      tooltip: {
        title: 'Masonry Services',
        points: [
          'Brick repairs and replacement',
          'Stone work and installation',
          'Concrete fixes',
          'Structural masonry',
          'Foundation repairs'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'HVAC Services', 
      icon: '🌡️',
      tooltip: {
        title: 'HVAC Services',
        points: [
          'Air conditioning repair',
          'Heating system maintenance',
          'Ventilation work',
          'Climate control setup',
          'Filter replacements'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Other Services', 
      icon: '📋',
      tooltip: {
        title: 'Specialized Services',
        points: [
          'Custom project consultation',
          'Specialized repairs',
          'Unique maintenance needs',
          'Project assessment',
          'Expert recommendations'
        ]
      }
    },
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
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';

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
      selectedDate.setHours(0, 0, 0, 0);
      
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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));

    // Clear error when user selects a date
    if (errors.appointmentDate) {
      setErrors(prev => ({
        ...prev,
        appointmentDate: ''
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
      
      // Format the appointment date for the API
      if (formData.appointmentDate) {
        const formattedDate = formData.appointmentDate.toISOString().split('T')[0];
        formDataToSend.append('appointmentDate', formattedDate);
      }
      
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
          appointmentDate: null,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white py-20" style={{backgroundColor: '#013b4b'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FaTools className="w-16 h-16 text-white mx-auto" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold">
              Repair & Maintenance Services
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Professional repair and maintenance services for your home or office. 
              Get expert help for all your construction and maintenance needs.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 relative">
                {serviceTypes.map((service, index) => (
                  <div key={index} className="relative">
                    <label
                      className={`relative flex flex-col items-center cursor-pointer rounded-lg border p-4 text-center transition-all duration-200 ${
                        formData.serviceSubType === service.label
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                      }`}
                      onMouseEnter={() => setHoveredService(index)}
                      onMouseLeave={() => setHoveredService(null)}
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

                    {/* Tooltip */}
                    {hoveredService === index && (
                      <motion.div 
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 backdrop-blur-md bg-white/90 border border-white/20 text-gray-800 rounded-xl shadow-2xl overflow-hidden"
                        style={{ minWidth: '280px', maxWidth: '320px' }}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-primary-600/20 to-primary-700/20 backdrop-blur-sm border-b border-gray-200/30">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {service.tooltip.title}
                          </h4>
                        </div>

                        {/* Points List */}
                        <div className="px-4 py-3 space-y-2">
                          {service.tooltip.points.map((point, pointIndex) => (
                            <motion.div 
                              key={pointIndex}
                              className="flex items-start space-x-2 text-xs text-gray-700"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.3, 
                                delay: pointIndex * 0.1,
                                ease: "easeOut"
                              }}
                            >
                              <span className="text-primary-500 mt-1 flex-shrink-0 font-bold">•</span>
                              <span className="leading-relaxed">{point}</span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="border-8 border-transparent border-t-white/90"></div>
                        </div>

                        {/* Frosted glass effect border */}
                        <div className="absolute inset-0 rounded-xl ring-1 ring-gray-200/50 pointer-events-none"></div>
                      </motion.div>
                    )}
                  </div>
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
                <DatePicker
                  selected={formData.appointmentDate}
                  onChange={handleDateChange}
                  minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                  dateFormat="yyyy-MM-dd"
                  className={`input-field w-full ${errors.appointmentDate ? 'border-red-500' : ''}`}
                  placeholderText="Select preferred date"
                  showPopperArrow={false}
                  popperPlacement="bottom-start"
                />
                <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
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
    </div>
  );
};

export default RepairMaintenance;
