import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaServicestack,
  FaCheck
} from 'react-icons/fa';

import { bookingService } from '../../services';
import { useApp } from '../../context/AppContext';

const BookingForm = ({ serviceType = null, onSuccess = null }) => {
  const { setLoading } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    municipality: '',
    serviceType: serviceType || '3d_design',
    appointmentDate: null,
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update serviceType when prop changes
  useEffect(() => {
    if (serviceType) {
      setFormData(prev => ({
        ...prev,
        serviceType: serviceType
      }));
    }
  }, [serviceType]);

  const serviceOptions = [
    { value: '3d_design', label: '3D Design & Visualization' },
    { value: 'full_package', label: 'Full House Construction Package' },
    { value: 'consultation', label: 'Construction Consultation' },
    { value: 'repair_maintenance', label: 'Repair & Maintenance' }
  ];

  const municipalities = [
    'Lalitpur Metropolitan City',
    'Kathmandu Metropolitan City',
    'Bhaktapur Municipality',
    'Madhyapur Thimi Municipality',
    'Godawari Municipality',
    'Mahalaxmi Municipality',
    'Konjyosom Rural Municipality',
    'Bagmati Rural Municipality'
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Email validation (optional but if provided, must be valid)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // Date validation
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    } else if (formData.appointmentDate <= new Date()) {
      newErrors.appointmentDate = 'Appointment date must be in the future';
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

    if (errors.appointmentDate) {
      setErrors(prev => ({
        ...prev,
        appointmentDate: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload support
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (key === 'appointmentDate') {
          submitData.append(key, formData[key].toISOString());
        } else if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await bookingService.createBooking(submitData);

      if (response.success) {
        setIsSubmitted(true);
        toast.success(response.message || 'Appointment booked successfully!');
        
        if (onSuccess) {
          onSuccess(response.data);
        }

        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          ward: '',
          municipality: '',
          serviceType: serviceType || '3d_design',
          appointmentDate: null,
          message: ''
        });
      } else {
        throw new Error(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      
      if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.errors.forEach(err => {
          backendErrors[err.path || err.param] = err.msg;
        });
        setErrors(backendErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error(error.message || 'Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <FaCheck className="w-10 h-10 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-bold text-gray-900">
            Appointment Booked Successfully!
          </h3>
          <p className="text-gray-600">
            Thank you for choosing Diagonal Construction. We will contact you soon to confirm your appointment.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Our team will call you within 24 hours</li>
            <li>• We'll confirm the appointment details</li>
            <li>• Prepare any questions you'd like to discuss</li>
            <li>• Bring any reference images or ideas you have</li>
          </ul>
        </div>

        <button 
          onClick={() => setIsSubmitted(false)}
          className="btn-outline"
        >
          Book Another Appointment
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FaUser className="w-5 h-5 text-primary-600" />
          <span>Personal Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="98XXXXXXXX"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FaMapMarkerAlt className="w-5 h-5 text-primary-600" />
          <span>Address Information</span>
        </h3>

        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Enter your complete address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="input-field"
                placeholder="e.g., Ward 5"
              />
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Municipality
              </label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select Municipality</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FaServicestack className="w-5 h-5 text-primary-600" />
          <span>Service Details</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="input-field"
            >
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date *
            </label>
            <DatePicker
              selected={formData.appointmentDate}
              onChange={handleDateChange}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow onwards
              dateFormat="MMMM d, yyyy"
              className={`input-field w-full ${errors.appointmentDate ? 'border-red-500' : ''}`}
              placeholderText="Select appointment date"
              showPopperArrow={false}
            />
            {errors.appointmentDate && (
              <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="3"
            className="input-field"
            placeholder="Tell us more about your project requirements..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <FaCalendarAlt className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          By submitting this form, you agree to our terms and conditions. 
          We'll contact you within 24 hours to confirm your appointment.
        </p>
      </div>
    </motion.form>
  );
};

export default BookingForm;
