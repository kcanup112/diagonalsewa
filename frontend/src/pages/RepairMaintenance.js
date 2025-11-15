import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import imageCompression from 'browser-image-compression';
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
  FaTimes,
  FaCompress,
  FaHammer,
  FaScrewdriver,
  FaWrench
} from 'react-icons/fa';

import { bookingService } from '../services';
import { useApp } from '../context/AppContext';

// Animated Tool Icons Component
const AnimatedToolIcons = () => {
  const tools = [
    { icon: FaHammer, delay: 0 },
    { icon: FaScrewdriver, delay: 0.5 },
    { icon: FaWrench, delay: 1 }
  ];

  return (
    <div className="flex justify-center space-x-6 mb-6">
      {tools.map((Tool, index) => (
        <motion.div
          key={index}
          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            delay: Tool.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <Tool.icon className="w-8 h-8 text-white" />
        </motion.div>
      ))}
    </div>
  );
};

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
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);
  
  // Ref for scrolling to service selection section
  const serviceSelectionRef = useRef(null);
  
  // Scroll to service selection function
  const scrollToServiceSelection = () => {
    serviceSelectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  const [formData, setFormData] = useState({
    serviceType: 'repair_maintenance', // Default to repair_maintenance
    serviceSubTypes: [], // Changed to array for multiple selections
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
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({});

  const serviceTypes = [
    { 
      value: 'repair_maintenance', 
      label: 'General Repair & Maintenance', 
      icon: '🔧',
      gradient: 'from-blue-500 to-blue-600',
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
      gradient: 'from-cyan-500 to-blue-500',
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
      gradient: 'from-yellow-500 to-orange-500',
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
      gradient: 'from-purple-500 to-pink-500',
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
      gradient: 'from-amber-500 to-orange-500',
      tooltip: {
        title: 'Flooring Services',
        points: [
          'Tile replacement and repair',
          'Wood floor restoration',
          'Flooring installation',
          'Floor leveling'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Roofing & Waterproofing', 
      icon: '🏘️',
      gradient: 'from-gray-600 to-gray-700',
      tooltip: {
        title: 'Roofing & Waterproofing',
        points: [
          'Roof leak repairs',
          'Waterproofing solutions',
          'Gutter maintenance',
          'Weather protection',
          'Roof inspections',
          'Underground tank leakage/waterproofing'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Carpentry Work', 
      icon: '🔨',
      gradient: 'from-amber-700 to-yellow-800',
      tooltip: {
        title: 'Carpentry Services',
        points: [
          'Door and window repairs',
          'Cabinet installation',
          'Furniture fixes',
          'Custom woodwork',
          'Structural repairs',
          'Modular Kitchen Design & Installation'
          
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Masonry & Stonework', 
      icon: '🧱',
      gradient: 'from-red-500 to-red-600',
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
      label: 'Air Conditioning Repair and Installation', 
      icon: '🌡️',
      gradient: 'from-teal-500 to-cyan-500',
      tooltip: {
        title: 'Air Conditioning Repair and Installation Services',
        points: [
          'Air conditioning repair',
          'Heating system maintenance',
          'Ventilation work',
          'Filter replacements'
        ]
      }
    },
    { 
      value: 'repair_maintenance', 
      label: 'Metal Works', 
      icon: '🔩',
      gradient: 'from-gray-700 to-gray-800',
      tooltip: {
        title: 'Metal Works Services', 
        points: [
          'Metal fabrication',
          'Welding repairs',
          'Custom metal designs',
          'Metal installation'
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
    if (formData.serviceSubTypes.length === 0) newErrors.serviceType = 'Please select at least one service type';
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
    const { name, value, type, checked } = e.target;
    
    if (name === 'serviceSubTypes') {
      // Handle multiple service selection
      setFormData(prev => ({
        ...prev,
        serviceSubTypes: checked 
          ? [...prev.serviceSubTypes, value]
          : prev.serviceSubTypes.filter(service => service !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing/selecting
    if (errors[name] || (name === 'serviceSubTypes' && errors.serviceType)) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        serviceType: name === 'serviceSubTypes' ? '' : prev.serviceType
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

  // Image compression function
  const compressImage = async (file, index) => {
    try {
      setCompressionProgress(prev => ({ ...prev, [index]: 0 }));
      
      const options = {
        maxSizeMB: 1, // Maximum file size 1MB
        maxWidthOrHeight: 1920, // Maximum dimension 1920px
        useWebWorker: true,
        fileType: 'image/webp', // Convert to WebP for better compression
        initialQuality: 0.8, // Initial quality 80%
        onProgress: (progress) => {
          setCompressionProgress(prev => ({ ...prev, [index]: Math.round(progress) }));
        }
      };

      const compressedFile = await imageCompression(file, options);
      
      // Create a new File object with proper name and metadata
      const newFile = new File(
        [compressedFile], 
        `compressed_${file.name.split('.')[0]}.webp`, 
        {
          type: 'image/webp',
          lastModified: Date.now()
        }
      );

      // Add compression metadata
      newFile.originalSize = file.size;
      newFile.compressedSize = compressedFile.size;
      newFile.compressionRatio = Math.round(((file.size - compressedFile.size) / file.size) * 100);

      setCompressionProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });

      return newFile;
    } catch (error) {
      console.error('Compression error:', error);
      toast.error(`Failed to compress ${file.name}. Using original file.`);
      
      setCompressionProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });

      return file; // Return original file if compression fails
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    // Validate file types
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit before compression
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB before compression).`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    if (files.length + validFiles.length > 3) {
      toast.error('Maximum 3 files allowed. Please remove some files first.');
      return;
    }

    setIsCompressing(true);
    
    try {
      // Show compression start toast
      toast.loading('Compressing images...', { id: 'compression' });

      // Compress files in parallel
      const compressionPromises = validFiles.map((file, index) => 
        compressImage(file, files.length + index)
      );

      const compressedFiles = await Promise.all(compressionPromises);

      // Filter out any null results and add to files
      const successfulFiles = compressedFiles.filter(file => file !== null);
      
      if (successfulFiles.length > 0) {
        setFiles(prev => [...prev, ...successfulFiles].slice(0, 3));
        
        // Show compression success toast with stats
        const totalOriginalSize = successfulFiles.reduce((sum, file) => sum + (file.originalSize || file.size), 0);
        const totalCompressedSize = successfulFiles.reduce((sum, file) => sum + file.size, 0);
        const totalSavings = Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100);
        
        toast.success(
          `${successfulFiles.length} image(s) compressed successfully! Saved ${totalSavings}% space.`,
          { id: 'compression' }
        );
      }
    } catch (error) {
      console.error('File compression error:', error);
      toast.error('Failed to compress images. Please try again.', { id: 'compression' });
    } finally {
      setIsCompressing(false);
      // Reset the file input
      e.target.value = '';
    }
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
      if (formData.serviceSubTypes.length > 0) {
        fullMessage = `Selected Services: ${formData.serviceSubTypes.join(', ')}\n\nDescription: ${formData.message}`;
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
          serviceSubTypes: [],
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
    <div className="min-h-screen">
      {/* Hidden SEO and Search Keywords for Repair & Maintenance */}
      <div className="sr-only" aria-hidden="true">
        {/* Repair Services Keywords */}
        plumbing repair services Nepal plumber Kathmandu pipe leak repair drain cleaning
        water heater installation toilet repair faucet replacement shower repair
        bathroom plumbing kitchen plumbing emergency plumbing 24 hour plumber
        
        {/* Electrical Services Keywords */}
        electrical repair electrician Nepal electrical installation wiring repair
        electrical panel upgrade circuit breaker outlet installation switch repair
        lighting installation electrical maintenance electrical inspection
        emergency electrical service power outage electrical safety
        
        {/* AC and HVAC Keywords */}
        AC repair air conditioning service HVAC maintenance cooling system repair
        air conditioner installation refrigerant leak compressor repair
        ductless AC split AC window AC central AC heat pump service
        
        {/* Waterproofing Keywords */}
        waterproofing services Nepal waterproof basement roof waterproofing
        bathroom waterproofing terrace waterproofing moisture protection
        leak sealing dampness treatment mold prevention water damage repair
        
        {/* Remodeling Keywords */}
        home remodeling renovation services kitchen remodeling bathroom renovation
        room addition home improvement house renovation modernization upgrade
        interior remodeling exterior renovation property improvement
        
        {/* Maintenance Keywords */}
        home maintenance building maintenance property maintenance
        preventive maintenance regular maintenance annual maintenance
        maintenance contract facility management upkeep services
        
        {/* Emergency Services Keywords */}
        emergency repair 24/7 repair service urgent repair immediate service
        emergency plumbing emergency electrical emergency AC repair
        flood damage storm damage water damage emergency response
        
        {/* Additional Service Keywords */}
        handyman services general repair carpentry services painting services
        tile work flooring repair ceiling repair wall repair door repair window repair
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
            {/* Animated Tool Icons */}
            <AnimatedToolIcons />
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Your Home's Repair & Maintenance Experts
              </span>
              <span className="block text-white mt-2 text-lg md:text-2xl">
                Plumbing, Electrical, Waterproofing & More – All in One Place!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold text-yellow-300">Fast, reliable, and professional service</span> for every corner of your home. 
              Get <span className="font-bold text-orange-300">expert help</span> for all your construction and maintenance needs.
            </p>
            
            {/* Call to Action Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={scrollToServiceSelection}
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 hover:from-yellow-500 hover:via-orange-600 hover:to-red-500 text-gray-900 font-bold px-8 py-3 rounded-xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 group mx-auto"
              >
                <span>Fix it Today</span>
                <motion.div
                  className="transform group-hover:translate-x-1 transition-transform duration-300"
                >
                  🔧
                </motion.div>
              </button>
            </motion.div>

            {/* Reassurance Icons */}
            <motion.div
              className="mt-8 flex flex-wrap justify-center items-center gap-6 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2 text-white">
                <span className="text-green-400 text-lg">✅</span>
                <span className="text-sm md:text-base font-medium">24/7 Availability</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-green-400 text-lg">✅</span>
                <span className="text-sm md:text-base font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-green-400 text-lg">✅</span>
                <span className="text-sm md:text-base font-medium">100% Satisfaction Guarantee</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Form */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Service Type Selection */}
            <div ref={serviceSelectionRef}>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full font-bold text-sm mr-3">
                  1
                </div>
                <label className="text-lg font-semibold text-gray-800">
                  Choose the Service(s) you need *
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-6">Select one or more services that you need help with.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative">
                {serviceTypes.map((service, index) => {
                  const isSelected = formData.serviceSubTypes.includes(service.label);
                  return (
                    <motion.div 
                      key={index} 
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label
                        className={`relative flex flex-col items-center cursor-pointer rounded-2xl border-2 p-4 text-center transition-all duration-300 group shadow-sm hover:shadow-lg ${
                          isSelected
                            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg shadow-primary-200/50 transform scale-105'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white'
                        }`}
                        onMouseEnter={() => setHoveredService(index)}
                        onMouseLeave={() => setHoveredService(null)}
                        style={{
                          minHeight: '110px'
                        }}
                      >
                        <input
                          type="checkbox"
                          name="serviceSubTypes"
                          value={service.label}
                          checked={isSelected}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        
                        {/* Icon with consistent gradient background */}
                        <div className={`relative w-12 h-12 rounded-xl mb-2 flex items-center justify-center bg-gradient-to-br ${service.gradient} shadow-lg transform transition-transform duration-300 ${
                          isSelected ? 'scale-110 shadow-xl' : 'group-hover:scale-105'
                        }`}>
                          <span className="text-xl filter drop-shadow-sm">{service.icon}</span>
                          {/* Subtle shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                        </div>
                        
                        <span className={`text-sm font-semibold leading-tight transition-colors duration-300 ${
                          isSelected ? 'text-primary-800' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {service.label}
                        </span>

                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            <span className="text-white text-sm">✓</span>
                          </motion.div>
                        )}
                      </label>

                      {/* Enhanced Tooltip */}
                      {hoveredService === index && (
                        <motion.div 
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-[9999] backdrop-blur-md bg-white/95 border border-gray-200/50 text-gray-800 rounded-xl shadow-2xl overflow-hidden"
                          style={{ minWidth: '300px', maxWidth: '340px' }}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {/* Header with gradient */}
                          <div className={`px-5 py-4 bg-gradient-to-r ${service.gradient} text-white`}>
                            <h4 className="font-bold text-base">
                              {service.tooltip.title}
                            </h4>
                          </div>

                          {/* Points List */}
                          <div className="px-5 py-4 space-y-3">
                            {service.tooltip.points.map((point, pointIndex) => (
                              <motion.div 
                                key={pointIndex}
                                className="flex items-start space-x-3 text-sm text-gray-700"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  duration: 0.3, 
                                  delay: pointIndex * 0.05,
                                  ease: "easeOut"
                                }}
                              >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mt-2 flex-shrink-0`}></div>
                                <span className="leading-relaxed">{point}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                            <div className="border-8 border-transparent border-t-white/95"></div>
                          </div>

                          {/* Subtle border */}
                          <div className="absolute inset-0 rounded-xl ring-1 ring-gray-200/30 pointer-events-none"></div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              {/* Selected Services Summary */}
              {formData.serviceSubTypes.length > 0 && (
                <motion.div 
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="text-sm font-semibold text-green-800 mb-2">
                    Selected Services ({formData.serviceSubTypes.length}):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.serviceSubTypes.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              {errors.serviceType && (
                <motion.p 
                  className="text-red-500 text-sm mt-3 text-center font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.serviceType}
                </motion.p>
              )}
            </div>

            {/* Step 2: Problem Description */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full font-bold text-sm mr-3">
                  2
                </div>
                <label className="text-lg font-semibold text-gray-800">
                  Describe the problem or work needed *
                </label>
              </div>
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
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={isCompressing}
                  />
                  <label htmlFor="file-upload" className={`cursor-pointer ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isCompressing ? (
                      <>
                        <FaCompress className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                        <p className="text-blue-600 font-medium">
                          Compressing images...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Please wait while we optimize your images
                        </p>
                      </>
                    ) : (
                      <>
                        <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Click to upload photos or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Max 3 files • 10MB each before compression
                        </p>
                        
                      </>
                    )}
                  </label>
                </div>

                {/* Compression Progress */}
                {Object.keys(compressionProgress).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Compressing Images...</h4>
                    {Object.entries(compressionProgress).map(([index, progress]) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Image {parseInt(index) + 1}</span>
                          <span className="text-sm font-medium text-blue-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Preview */}
                {files.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaImage className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        
                        {/* File Info */}
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            {file.compressionRatio && (
                              <span className="text-green-600 font-medium">
                                -{file.compressionRatio}% 🗜️
                              </span>
                            )}
                          </div>
                          {file.originalSize && (
                            <p className="text-xs text-gray-400">
                              Original: {(file.originalSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>

                        {/* WebP Badge */}
                        {file.type === 'image/webp' && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            WebP
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Stats */}
                {files.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCompress className="w-4 h-4 text-green-600" />
                      <h4 className="text-sm font-medium text-green-800">Compression Summary</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-green-600 font-bold">{files.length}</p>
                        <p className="text-green-700">Files Ready</p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-600 font-bold">
                          {files.reduce((sum, file) => sum + file.size, 0) < 1024 * 1024 
                            ? `${(files.reduce((sum, file) => sum + file.size, 0) / 1024).toFixed(0)} KB`
                            : `${(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(1)} MB`
                          }
                        </p>
                        <p className="text-green-700">Total Size</p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-600 font-bold">
                          {files.filter(f => f.compressionRatio).length > 0 
                            ? `${Math.round(files.reduce((sum, file) => sum + (file.compressionRatio || 0), 0) / files.filter(f => f.compressionRatio).length)}%`
                            : 'N/A'
                          }
                        </p>
                        <p className="text-green-700">Avg. Savings</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Urgency Level */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full font-bold text-sm mr-3">
                  3
                </div>
                <label className="text-lg font-semibold text-gray-800">
                  Select urgency level *
                </label>
              </div>
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
            <p className="text-primary-600 font-medium mt-2">9801890011 / 015201768</p>
          </div>

          <div className="card text-center">
            <FaEnvelope className="w-8 h-8 text-secondary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600">Get detailed quotes and estimates</p>
            <p className="text-secondary-600 font-medium mt-2">info@diagonal.com</p>
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
