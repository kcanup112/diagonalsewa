import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  FaCube, 
  FaHome, 
  FaCalendarAlt, 
  FaCalculator,
  FaChartPie,
  FaClock,
  FaCheck
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Components
import BookingForm from '../components/Forms/BookingForm';
import CostCalculator from '../components/Calculator/CostCalculator';
import PortfolioDisplay from '../components/Portfolio/PortfolioDisplay';

const DesignConstruction = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('services'); // Start with services tab
  const [costData, setCostData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const [selectedService, setSelectedService] = useState(null); // Track selected service
  const [selectedSteps, setSelectedSteps] = useState([]); // Track selected design process steps

  // Handle step selection
  const handleStepClick = (step) => {
    if (!selectedSteps.find(s => s.step === step.step)) {
      setSelectedSteps([...selectedSteps, step]);
    }
  };

  // Remove a selected step
  const removeSelectedStep = (stepNumber) => {
    setSelectedSteps(selectedSteps.filter(s => s.step !== stepNumber));
  };

  // Clear all selected steps
  const clearAllSteps = () => {
    setSelectedSteps([]);
  };

  // Check URL parameters to auto-open booking tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tab') === 'booking') {
      setActiveTab('booking');
      toast.success('Welcome! Please fill out the booking form below.');
    }
  }, [location.search]);

  // Monitor state changes
  useEffect(() => {
    setRenderKey(prev => prev + 1); // Force re-render when data changes
  }, [costData]);

  useEffect(() => {
    // Timeline data state monitoring
  }, [timelineData]);

  // Handle service booking
  const handleBookService = (service) => {
    // Map service titles to service types
    const serviceTypeMap = {
      '3D Floor Plan Design': '3d_design',
      'Full Construction Package': 'full_package',
      'Construction Consultation': 'consultation'
    };
    
    const serviceType = serviceTypeMap[service.title] || '3d_design';
    setSelectedService({ ...service, type: serviceType });
    setActiveTab('booking');
    toast.success(`Selected ${service.title}. Please fill the booking form.`);
  };

  const tabs = [
    { id: 'services', name: 'Our Services', icon: FaCube },
    { id: 'portfolio', name: 'Portfolio', icon: FaHome },
    { id: 'booking', name: 'Book Appointment', icon: FaCalendarAlt },
    { id: 'calculator', name: 'Cost Calculator', icon: FaCalculator },
  ];

  const services = [
    {
      title: '3D Floor Plan Design',
      description: 'Detailed architectural drawings and 3D visualization',
      features: ['AutoCAD Drawings', '3D Modeling', 'Interior Design', 'Structural Plans'],
      price: 'Rs50/sq ft'
    },
    {
      title: 'Full Construction Package',
      description: 'Complete turnkey house construction from start to finish',
      features: ['Foundation to Roof', 'Quality Materials', 'Skilled Workers', 'Project Management'],
      price: 'Rs2,200/sq ft'
    },
    {
      title: 'Construction Consultation',
      description: 'Professional advice for your construction project',
      features: ['Site Analysis', 'Material Selection', 'Cost Estimation', 'Timeline Planning'],
      price: 'Rs150/hour'
    }
  ];

  const designProcess = [
    { 
      step: 1, 
      title: 'Initial Consultation', 
      description: 'Discuss your vision and requirements',
      icon: '💬',
      duration: '1-2 days',
      details: ['Project briefing', 'Site visit', 'Requirement analysis', 'Budget discussion']
    },
    { 
      step: 2, 
      title: '3D Design Creation', 
      description: 'Create detailed 3D models and floor plans',
      icon: '🎨',
      duration: '7-10 days',
      details: ['Conceptual design', '3D modeling', 'Floor plan creation', 'Interior visualization']
    },
    { 
      step: 3, 
      title: 'Review & Revisions', 
      description: 'Review designs and make necessary changes',
      icon: '🔄',
      duration: '3-5 days',
      details: ['Client presentation', 'Feedback collection', 'Design modifications', 'Final refinements']
    },
    { 
      step: 4, 
      title: 'Final Approval', 
      description: 'Approve final designs and construction plans',
      icon: '✅',
      duration: '1-2 days',
      details: ['Design finalization', 'Material selection', 'Cost estimation', 'Contract signing']
    },
    { 
      step: 5, 
      title: 'Construction Phase', 
      description: 'Begin construction with regular updates',
      icon: '🏗️',
      duration: '60-90 days',
      details: ['Foundation work', 'Structure building', 'Interior work', 'Regular inspections']
    },
    { 
      step: 6, 
      title: 'Project Completion', 
      description: 'Final inspection and handover',
      icon: '🎯',
      duration: '2-3 days',
      details: ['Quality check', 'Final inspection', 'Documentation', 'Key handover']
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white py-20" style={{backgroundColor: '#013b4b'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom">
          <motion.div 
            className="text-center space-y-6"
            {...fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold">
              3D Design & Construction Services
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              From concept to completion - we bring your dream home to life with 
              professional 3D visualization and quality construction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap mr-4 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <motion.div 
              className="space-y-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* What We Do */}
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-heading font-bold text-gray-900">
                  What We Do
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                  We provide complete solutions from 3D architectural design to full house construction. 
                  Our team combines traditional craftsmanship with modern technology to deliver exceptional results.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <motion.div 
                    key={index}
                    className="card hover:shadow-custom transition-all duration-300"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-heading font-semibold text-gray-900">
                          {service.title}
                        </h3>
                        <span className="text-lg font-bold text-primary-600">
                          {service.price}
                        </span>
                      </div>

                      <p className="text-gray-600">{service.description}</p>

                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2">
                            <FaCheck className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button 
                        onClick={() => handleBookService(service)}
                        className="btn-primary w-full"
                      >
                        Book This Service
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* New Layout: Single Column Steps with Right Side Details */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                    Our Design Process
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">
                    Click on any step to see detailed information
                  </p>
                  
                  {/* Clear All Button */}
                  {selectedSteps.length > 0 && (
                    <button
                      onClick={clearAllSteps}
                      className="mb-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Clear All Details ({selectedSteps.length})
                    </button>
                  )}
                </div>

                {/* Main Layout: Steps on Left, Details on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Process Steps */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                        📋
                      </span>
                      Design Process Steps
                    </h3>
                    
                    {designProcess.map((process, index) => (
                      <motion.div 
                        key={index}
                        className={`bg-white rounded-lg p-3 shadow-md hover:shadow-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedSteps.find(s => s.step === process.step) 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onClick={() => handleStepClick(process)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Step Number */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            selectedSteps.find(s => s.step === process.step)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {process.step}
                          </div>
                          
                          {/* Step Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {process.title}
                              </h4>
                              <span className="text-lg">{process.icon}</span>
                            </div>
                            <p className="text-gray-600 text-xs mb-1">{process.description}</p>
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              ⏱️ {process.duration}
                            </span>
                          </div>
                          
                          {/* Selection Indicator */}
                          <div className="flex flex-col items-center">
                            {selectedSteps.find(s => s.step === process.step) ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <FaCheck className="w-2 h-2 text-white" />
                              </motion.div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-primary-500">
                                <span className="text-xs text-gray-400">+</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right Column: Selected Step Details */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-secondary-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                        📋
                      </span>
                      Step Details
                      {selectedSteps.length > 0 && (
                        <span className="ml-2 text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                          {selectedSteps.length} selected
                        </span>
                      )}
                    </h3>
                    
                    {selectedSteps.length === 0 ? (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="text-4xl mb-3">👈</div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          No Steps Selected
                        </h4>
                        <p className="text-gray-500 text-sm">
                          Click on any step from the left to see detailed information here.
                          You can select multiple steps to compare them.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedSteps.map((step, index) => (
                          <motion.div
                            key={step.step}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            {/* Step Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                  {step.step}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                                  <span className="text-lg">{step.icon}</span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedStep(step.step);
                                }}
                                className="w-5 h-5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors text-xs"
                                title="Remove this step"
                              >
                                ×
                              </button>
                            </div>
                            
                            {/* Step Description */}
                            <p className="text-gray-600 mb-3 text-xs">{step.description}</p>
                            
                            {/* Duration */}
                            <div className="mb-3">
                              <span className="inline-block bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                                ⏱️ Duration: {step.duration}
                              </span>
                            </div>
                            
                            {/* Key Activities */}
                            <div className="border-t border-gray-200 pt-3">
                              <h5 className="text-xs font-semibold text-gray-800 mb-2 flex items-center">
                                <span className="mr-1">📋</span>
                                Key Activities:
                              </h5>
                              <ul className="space-y-1">
                                {step.details.map((detail, detailIndex) => (
                                  <motion.li
                                    key={detailIndex}
                                    className="flex items-start space-x-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: detailIndex * 0.05 }}
                                  >
                                    <span className="w-1.5 h-1.5 bg-secondary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span className="text-xs text-gray-700">{detail}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Section */}
                {selectedSteps.length > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      📊 Selected Steps Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-600">
                          {selectedSteps.length}
                        </div>
                        <div className="text-sm text-gray-600">Steps Selected</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary-600">
                          {selectedSteps.reduce((total, step) => {
                            const days = parseInt(step.duration.split('-')[1] || step.duration.split(' ')[0]);
                            return total + days;
                          }, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Max Days</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent-600">
                          {selectedSteps.reduce((total, step) => total + step.details.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Activities</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <motion.div 
              className="space-y-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Portfolio Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
                  <div className="text-gray-600">3D Designs Created</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-primary-600 mb-2">30+</div>
                  <div className="text-gray-600">Houses Completed</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
                  <div className="text-gray-600">Happy Clients</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-primary-600 mb-2">5+</div>
                  <div className="text-gray-600">Years Experience</div>
                </motion.div>
              </div>

              {/* Dynamic Portfolio Display */}
              <PortfolioDisplay />

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Project?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Let us create stunning 3D visualizations for your dream home. 
                  Book a consultation today and see your vision come to life.
                </p>
                <button 
                  onClick={() => setActiveTab('booking')}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Book Consultation
                </button>
              </div>
            </motion.div>
          )}

          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                    Book an Appointment
                  </h2>
                  <p className="text-xl text-gray-600">
                    Schedule a consultation with our design experts
                  </p>
                  
                  {/* Business Hours */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center space-x-2">
                      <FaCalendarAlt className="w-5 h-5 text-primary-600" />
                      <span>Business Hours</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Sunday - Friday</span>
                            <span className="text-primary-600 font-semibold">10:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Saturday</span>
                            <span className="text-red-600 font-semibold">Closed</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <p>📞 <strong>Emergency Contact:</strong> Available 24/7</p>
                            <p>💬 <strong>Online Support:</strong> Business hours only</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-primary-200 pt-3 mt-4">
                        <p className="text-sm text-center text-gray-600">
                          <strong>Note:</strong> Appointments can be scheduled during business hours. 
                          We'll confirm your preferred time within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedService && (
                    <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <FaCheck className="w-5 h-5 text-primary-600" />
                        <span className="text-primary-800 font-medium">
                          Selected Service: {selectedService.title}
                        </span>
                      </div>
                      <p className="text-primary-600 text-sm mt-1">
                        {selectedService.description}
                      </p>
                    </div>
                  )}
                </div>
                <BookingForm 
                  serviceType={selectedService?.type}
                  onSuccess={() => {
                    toast.success('🎉 Booking submitted successfully! We will contact you soon.');
                    setSelectedService(null);
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                    House Construction Cost Calculator
                  </h2>
                  <p className="text-xl text-gray-600">
                    Get an estimated cost for your construction project
                  </p>
                </div>
                
                <CostCalculator 
                  onCalculationComplete={(data) => {
                    setCostData(data.costEstimation);
                    setTimelineData(data.timeline);
                    
                    // Auto-switch to calculator tab to show results
                    setActiveTab('calculator');
                    
                    toast.success('Results updated! Check below.');
                  }}
                />

                {/* Results */}
                {costData && costData.pieChartData && Array.isArray(costData.pieChartData) && (
                  <div key={renderKey} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Cost Breakdown */}
                    <motion.div 
                      className="card"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <FaChartPie className="w-6 h-6 text-primary-600" />
                          <h3 className="text-xl font-semibold">Cost Breakdown</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary-600">
                              ₹{costData.totalCost?.toLocaleString()}
                            </div>
                            <div className="text-gray-600">
                              Total Estimated Cost
                            </div>
                            <div className="text-sm text-gray-500">
                              ₹{costData.ratePerSqFt}/sq ft
                            </div>
                          </div>

                          <div className="space-y-3">
                            {costData.pieChartData.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span>{item.name}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">₹{item.amount?.toLocaleString()}</div>
                                  <div className="text-sm text-gray-500">{item.value}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Timeline */}
                    {timelineData && (
                      <motion.div 
                        className="card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2">
                            <FaClock className="w-6 h-6 text-primary-600" />
                            <h3 className="text-xl font-semibold">Project Timeline</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-secondary-600">
                                {timelineData.projectInfo.totalDuration} days
                              </div>
                              <div className="text-gray-600">
                                Estimated Duration
                              </div>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                              {timelineData.phases.slice(0, 6).map((phase, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                                  <div>
                                    <div className="font-medium text-sm">{phase.name}</div>
                                    <div className="text-xs text-gray-500">{phase.duration} days</div>
                                  </div>
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: phase.color }}
                                  ></div>
                                </div>
                              ))}
                            </div>

                            <button 
                              onClick={() => {
                                // Would open detailed timeline view
                                toast.success('Detailed timeline feature coming soon!');
                              }}
                              className="btn-outline w-full text-sm"
                            >
                              View Detailed Timeline
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DesignConstruction;
