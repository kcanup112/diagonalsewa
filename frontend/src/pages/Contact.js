import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
  FaSpinner,
  FaWhatsapp
} from 'react-icons/fa';

import { contactService } from '../services';
import { useApp } from '../context/AppContext';

const Contact = () => {
  const { setLoading } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: 'general'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'project', label: 'New Project' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'support', label: 'Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'career', label: 'Career Opportunities' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await contactService.submitContact(formData);

      if (response.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiry_type: 'general'
        });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      
      if (error.errors && Array.isArray(error.errors)) {
        const backendErrors = {};
        error.errors.forEach(err => {
          backendErrors[err.path || err.param] = err.msg;
        });
        setErrors(backendErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error(error.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+977-123-456789', '+977-987-654321'],
      color: 'primary'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['info@constructionco.com', 'sales@constructionco.com'],
      color: 'secondary'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['New Road, Kathmandu', 'Nepal'],
      color: 'accent'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
      color: 'gray'
    }
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: '#', color: 'blue' },
    { icon: FaTwitter, url: '#', color: 'sky' },
    { icon: FaInstagram, url: '#', color: 'pink' },
    { icon: FaLinkedinIn, url: '#', color: 'blue' },
    { icon: FaWhatsapp, url: '#', color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to start your construction project? Have questions about our services? 
            We're here to help and would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-${info.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 text-${info.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Social Media */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-10 h-10 bg-${social.color}-100 hover:bg-${social.color}-200 rounded-lg flex items-center justify-center transition-colors`}
                    >
                      <IconComponent className={`w-5 h-5 text-${social.color}-600`} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Emergency Services</h3>
              <p className="text-red-700 text-sm mb-3">
                24/7 emergency repair and maintenance services available
              </p>
              <a 
                href="tel:+977123456789" 
                className="btn-outline border-red-300 text-red-700 hover:bg-red-100 block text-center"
              >
                Call Emergency Line
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Inquiry
                  </label>
                  <select
                    name="inquiry_type"
                    value={formData.inquiry_type}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name and Email */}
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
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
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

                {/* Phone and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="9812345678"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                      placeholder="Brief subject of your inquiry"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Please provide details about your project, requirements, timeline, budget, or any questions you may have..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="card p-0 overflow-hidden">
            <div className="bg-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Location</h3>
                <p className="text-gray-600">
                  New Road, Kathmandu, Nepal
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Interactive map integration would be implemented here
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="card text-center">
            <FaPhone className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Call Us Now</h3>
            <p className="text-gray-600 mb-4">
              Speak with our experts directly for immediate assistance
            </p>
            <a href="tel:+977123456789" className="btn-primary">
              Call Now
            </a>
          </div>

          <div className="card text-center">
            <FaEnvelope className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Request Quote</h3>
            <p className="text-gray-600 mb-4">
              Get a detailed quote for your construction project
            </p>
            <button className="btn-secondary">
              Get Quote
            </button>
          </div>

          <div className="card text-center">
            <FaWhatsapp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Chat</h3>
            <p className="text-gray-600 mb-4">
              Quick chat with our team on WhatsApp
            </p>
            <a 
              href="https://wa.me/977123456789" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-outline border-green-300 text-green-700 hover:bg-green-50"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
