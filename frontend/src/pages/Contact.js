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
import SEOHead from '../components/SEOHead';

import { contactService } from '../services/api';
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
      details: ['+9779801890011', '015201768'],
      color: 'primary'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['info@diagonal.com', 'sales@diagonal.com'],
      color: 'secondary'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['Balkumari, laitpur', 'Nepal','opposite of balkuamari Petrol pump'],
      color: 'accent'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Sun - Fri: 10:00 AM - 6:00 PM'],
      color: 'gray'
    }
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: '', color: 'blue' },
    { icon: FaTwitter, url: '#', color: 'sky' },
    { icon: FaInstagram, url: 'https://www.instagram.com/diagonalgroup/', color: 'pink' },
    { icon: FaLinkedinIn, url: '#', color: 'blue' },
    { icon: FaWhatsapp, url: '#', color: 'green' }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact Us | Get in Touch - Diagonal Group Construction Nepal"
        description="Contact Diagonal Group for construction, 3D design, and repair services in Kathmandu, Nepal. Call +977-9801890011 or email info@diagonal.com for project inquiries, quotes, and consultations."
        keywords="contact construction company Nepal, Diagonal Group contact, construction inquiry Kathmandu, project quote Nepal, construction consultation, contact builder Nepal, Kathmandu construction company location, emergency repair contact"
        canonical="/contact"
        schemaMarkup={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'Organization',
            name: 'Diagonal Group',
            telephone: '+977-9801890011',
            email: 'info@diagonal.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Kathmandu',
              addressCountry: 'NP'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+977-9801890011',
              contactType: 'Customer Service',
              areaServed: 'NP',
              availableLanguage: ['English', 'Nepali']
            }
          }
        }}
      />
      {/* Hidden SEO and Search Keywords for Contact */}
      <div className="sr-only" aria-hidden="true">
        {/* Contact Information Keywords */}
        contact Diagonal Enterprises Nepal construction company contact information
        Kathmandu office New Road location phone number email address
        customer service support help assistance inquiry consultation
        
        {/* Service Inquiry Keywords */}
        construction inquiry design consultation project discussion quote request
        estimate request cost estimation budget planning site visit
        free consultation professional consultation expert advice
        construction planning architectural consultation building permit help
        
        {/* Communication Keywords */}
        get in touch reach us contact form email contact phone contact
        office hours business hours meeting schedule appointment booking
        project inquiry service inquiry partnership inquiry career inquiry
        
        {/* Location Keywords */}
        Diagonal Group location Nepal office Kathmandu office New Road address
        construction company Nepal building contractor Nepal architect Nepal
        visit our office directions map location Google Maps
        
        {/* Emergency Contact Keywords */}
        emergency contact 24/7 support urgent inquiry immediate assistance
        emergency repair emergency service after hours contact
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative text-white pt-36 pb-16 overflow-hidden" style={{backgroundColor: '#013b4b'}}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-10 right-1/3 w-16 h-16 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            ></div>
          </div>
        </div>
        
        <div className="relative container-custom">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-gray-900 font-bold mb-4">
              📞 Get In Touch
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Contact Us
              </span>
              <span className="block text-white mt-2">We're Here to Help</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Have a question or ready to start your project? <span className="font-bold text-yellow-300">Reach out to us</span> and 
              let's <span className="font-bold text-orange-300">turn your vision into reality</span>!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                href="tel:+9779801890011" 
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
            <div className="bg-gray-100">
              <div className="p-6 bg-white border-b">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Us on Google Maps</h3>
                <p className="text-gray-600">
                  Visit our office at New Road, Kathmandu, Nepal
                </p>
              </div>
              <div className="h-96 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d429.0!2d85.3409287!3d27.6715729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1943930ad0dd%3A0x3141b7d0ce03519d!2sDiagonal%20Group!5e0!3m2!1sen!2snp!4v1725963847235!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Diagonal Group Location - New Road, Kathmandu, Nepal"
                ></iframe>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span className="text-sm font-medium">New Road, Kathmandu, Nepal</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Diagonal+Group/@27.6715729,85.3409287,429m/data=!3m1!1e3!4m6!3m5!1s0x39eb1943930ad0dd:0x3141b7d0ce03519d!8m2!3d27.6715447!4d85.34143!16s%2Fg%2F11j5zhqckt?entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
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
            <a href="tel:+9779801890011" className="btn-primary">
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
              href="https://wa.me/9779801890019" 
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
    </div>
  );
};

export default Contact;
