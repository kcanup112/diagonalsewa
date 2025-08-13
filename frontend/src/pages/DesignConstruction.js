import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
// Removed most icons from content areas for cleaner design - keeping only essential navbar and functional icons
import { toast } from 'react-hot-toast';

// Components
import BookingForm from '../components/Forms/BookingForm';
// import CostCalculator from '../components/Calculator/CostCalculator';
import CompactPortfolioViewer from '../components/Portfolio/CompactPortfolioViewer';

const DesignConstruction = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('services'); // Start with services tab
  const [costData, setCostData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const [selectedService, setSelectedService] = useState(null); // Track selected service
  const [selectedProcessStep, setSelectedProcessStep] = useState(null); // Track selected process step for popup
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0, clickedX: 0 }); // Track popup position
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state for collapsible tabs

  // Handle scroll for collapsible tabs
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100); // Collapse after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle process step popup
  const openProcessPopup = (step, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position above the clicked element with better bounds checking
    const modalWidth = 320; // Fixed modal width
    const modalHeight = 400; // Estimated modal height
    
    // Calculate horizontal position (centered on clicked element)
    let leftPosition = rect.left + rect.width / 2 - modalWidth / 2;
    leftPosition = Math.max(16, Math.min(leftPosition, viewportWidth - modalWidth - 16));
    
    // Calculate vertical position (above clicked element with padding)
    let topPosition = rect.top + scrollTop - modalHeight - 20; // 20px gap above element
    
    // If modal would go above viewport, position it below instead
    if (topPosition < scrollTop + 80) { // 80px for header
      topPosition = rect.bottom + scrollTop + 20; // Position below with gap
    }
    
    // Ensure modal stays within viewport bounds
    topPosition = Math.max(scrollTop + 80, Math.min(topPosition, scrollTop + viewportHeight - modalHeight - 20));
    
    setPopupPosition({
      x: leftPosition,
      y: topPosition,
      clickedX: rect.left + rect.width / 2 // Store original click position for arrow
    });
    
    setSelectedProcessStep(step);
  };

  const closeProcessPopup = () => {
    setSelectedProcessStep(null);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

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
    { id: 'services', name: 'Our Services', icon: () => <span>🏗️</span> },
    { id: 'portfolio', name: 'Portfolio', icon: () => <span>🏠</span> },
    { id: 'booking', name: 'Book Appointment', icon: () => <span>📅</span> },
  // { id: 'calculator', name: 'Cost Calculator', icon: FaCalculator },
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
      color: '#3B82F6',
      details: ['Project briefing', 'Site visit', 'Requirement analysis', 'Budget discussion']
    },
    { 
      step: 2, 
      title: '3D Design Creation', 
      description: 'Create detailed 3D models and floor plans',
      icon: '🎨',
      color: '#10B981',
      details: ['Conceptual design', '3D modeling', 'Floor plan creation', 'Interior visualization']
    },
    { 
      step: 3, 
      title: 'Review & Revisions', 
      description: 'Review designs and make necessary changes',
      icon: '🔄',
      color: '#F59E0B',
      details: ['Client presentation', 'Feedback collection', 'Design modifications', 'Final refinements']
    },
    { 
      step: 4, 
      title: 'Final Approval', 
      description: 'Approve final designs and construction plans',
      icon: '✅',
      color: '#8B5CF6',
      details: ['Design finalization', 'Material selection', 'Cost estimation', 'Contract signing']
    },
    { 
      step: 5, 
      title: 'Construction Phase', 
      description: 'Begin construction with regular updates',
      icon: '🏗️',
      color: '#EF4444',
      details: ['Foundation work', 'Structure building', 'Interior work', 'Regular inspections']
    },
    { 
      step: 6, 
      title: 'Project Completion', 
      description: 'Final inspection and handover',
      icon: '🎯',
      color: '#06B6D4',
      details: ['Quality check', 'Final inspection', 'Documentation', 'Key handover']
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen" style={{
      /* Hide scrollbar for Chrome, Safari and Opera */
      scrollbarWidth: 'none', /* Firefox */
      msOverflowStyle: 'none'  /* Internet Explorer and Edge */
    }}>
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* Hidden SEO and Search Keywords */}
      <div className="sr-only" aria-hidden="true">
        {/* Core Services Keywords */}
        3D design visualization architectural services Nepal construction company Kathmandu
        floor plan blueprint AutoCAD drawings structural engineering interior design exterior design
        house construction residential building turnkey construction custom home builder
        project management construction supervision quality control building contractor
        
        {/* Specific Service Keywords */}
        architectural visualization 3D modeling rendering walkthrough virtual tour photorealistic
        construction materials cement concrete steel brick tile paint lumber electrical plumbing
        foundation work structural work finishing work roofing insulation flooring
        site planning building permits construction timeline cost estimation budget planning
        
        {/* Professional Services Keywords */}
        licensed contractor certified architect professional engineer construction management
        quality assurance building codes compliance safety standards building inspection
        custom design luxury homes modern architecture traditional design sustainable building
        
        {/* Technology Keywords */}
        CAD software SketchUp Revit 3D visualization software building information modeling BIM
        construction technology modern construction methods prefabricated construction
        
        {/* Location Keywords */}
        Nepal construction Kathmandu building services Lalitpur construction Bhaktapur builders
        valley construction services Pokhara construction company construction Nepal
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
            {...fadeInUp}
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-gray-900 font-bold mb-4">
              🏗️ Professional Services
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                3D Design & Construction
              </span>
              <span className="block text-white mt-2">Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              From concept to completion - we bring your <span className="font-bold text-yellow-300">dream home to life</span> with 
              <span className="font-bold text-orange-300"> professional 3D visualization</span> and quality construction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collapsible Tab Navigation */}
      <section className={`bg-white shadow-sm sticky top-16 z-40 border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'py-1' : 'py-3'}`}>
        <div className="container-custom">
          <div className="flex justify-center overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex flex-col items-center transition-all duration-300 font-semibold border-2 border-transparent ${
                  isScrolled 
                    ? 'space-y-0 px-3 py-2 rounded-lg text-xs shadow-sm hover:px-4 hover:py-1.5 hover:space-y-0.5' 
                    : 'space-y-0.5 px-4 py-1.5 rounded-lg text-sm shadow-sm'
                } ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white border-primary-600 scale-105'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100 hover:border-primary-400'
                }`}
                style={{ 
                  minWidth: isScrolled ? '40px' : (tab.id === 'booking' ? '140px' : '140px'), 
                  minHeight: isScrolled ? '32px' : '36px' 
                }}
              >
                <tab.icon className={`${isScrolled ? 'w-4 h-4' : 'w-4 h-4'} transition-all duration-300`} />
                <span className={`${isScrolled ? 'opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-10' : 'opacity-100 max-h-10'} transition-all duration-300`}>
                  {tab.name}
                </span>
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
                            <div className="w-2 h-2 bg-secondary-500 rounded-full flex-shrink-0"></div>
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

              {/* Design Process Chart */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                    Our Design Process
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Click on any step to see detailed key activities
                  </p>
                </div>

                {/* Process Flow Chart */}
                <div className="relative">
                  {/* Desktop Layout - Horizontal Flow */}
                  <div className="hidden lg:block">
                    <div className="flex items-center justify-between relative">
                      {/* Connecting Lines */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"></div>
                      
                      {designProcess.map((process, index) => (
                        <div key={process.step} className="relative z-10">
                          <motion.div
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={(event) => openProcessPopup(process, event)}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Step Circle */}
                            <div 
                              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 mb-4"
                              style={{ backgroundColor: process.color }}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-1">{process.icon}</div>
                                <div className="text-xs">{process.step}</div>
                              </div>
                            </div>
                            
                            {/* Step Info */}
                            <div className="text-center max-w-32">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary-600 transition-colors duration-300">
                                {process.title}
                              </h4>
                              <p className="text-xs text-gray-600 leading-tight">
                                {process.description}
                              </p>
                            </div>
                          </motion.div>
                          
                          {/* Arrow between steps */}
                          {index < designProcess.length - 1 && (
                            <div className="absolute top-10 -right-8 z-10">
                              <span className="text-gray-400 text-xl">→</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout - Vertical Flow */}
                  <div className="lg:hidden space-y-6">
                    {designProcess.map((process, index) => (
                      <div key={process.step} className="relative">
                        <motion.div
                          className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg cursor-pointer border-2 border-gray-100 hover:border-primary-200 transition-all duration-300"
                          onClick={(event) => openProcessPopup(process, event)}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Step Circle */}
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0"
                            style={{ backgroundColor: process.color }}
                          >
                            <div className="text-center">
                              <div className="text-xl mb-1">{process.icon}</div>
                              <div className="text-xs">{process.step}</div>
                            </div>
                          </div>
                          
                          {/* Step Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base mb-1">
                              {process.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {process.description}
                            </p>
                            <p className="text-xs text-primary-600 mt-2 font-medium">
                              Click to see key activities →
                            </p>
                          </div>
                        </motion.div>
                        
                        {/* Connecting line for mobile */}
                        {index < designProcess.length - 1 && (
                          <div className="flex justify-center my-2">
                            <div className="w-0.5 h-8 bg-gray-300"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                  <p className="text-gray-600 mb-4">
                    Ready to start your design journey?
                  </p>
                  <button 
                    onClick={() => setActiveTab('booking')}
                    className="btn-primary text-lg px-8 py-3"
                  >
                    Start Your Project
                  </button>
                </div>
              </div>

              {/* Process Step Popup Modal */}
              <AnimatePresence>
                {selectedProcessStep && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black bg-opacity-50"
                      onClick={closeProcessPopup}
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Modal Header */}
                      <div 
                        className="px-6 py-4 text-white relative"
                        style={{ backgroundColor: selectedProcessStep.color }}
                      >
                        <button
                          onClick={closeProcessPopup}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-colors duration-200 flex items-center justify-center"
                        >
                          <span className="text-white text-lg">×</span>
                        </button>
                        
                        <div className="flex items-center space-x-3 pr-10">
                          <div className="text-3xl">{selectedProcessStep.icon}</div>
                          <div>
                            <div className="text-sm opacity-90">Step {selectedProcessStep.step}</div>
                            <h3 className="text-xl font-bold">{selectedProcessStep.title}</h3>
                          </div>
                        </div>
                        
                        <p className="text-sm opacity-90 mt-3">
                          {selectedProcessStep.description}
                        </p>
                      </div>
                      
                      {/* Modal Body */}
                      <div className="px-6 py-6 max-h-96 overflow-y-auto">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">📋</span>
                          Key Activities
                        </h4>
                        
                        <div className="space-y-3">
                          {selectedProcessStep.details.map((detail, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div 
                                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                style={{ backgroundColor: selectedProcessStep.color }}
                              ></div>
                              <span className="text-gray-700 text-sm leading-relaxed">{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                          <p className="text-sm text-gray-500">
                            Step {selectedProcessStep.step} of {designProcess.length} in our design process
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
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
              <CompactPortfolioViewer />

              <div className="text-center">
                <button 
                  onClick={() => window.open('/portfolio', '_blank')}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>View Full Portfolio Gallery</span>
                  <span>→</span>
                </button>
              </div>

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
                      <span className="text-2xl">📅</span>
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
                        <span className="text-green-600 text-xl">✓</span>
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

          {/* Calculator Tab is now fully removed for now. */}
        </div>
      </section>
    </div>
  );
};

export default DesignConstruction;
