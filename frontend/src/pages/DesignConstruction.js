import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const DesignConstruction = () => {
  const [activeTab, setActiveTab] = useState('calculator'); // Start with calculator tab
  const [costData, setCostData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const [selectedService, setSelectedService] = useState(null); // Track selected service

  // Monitor state changes
  useEffect(() => {
    console.log('costData state changed:', costData);
    setRenderKey(prev => prev + 1); // Force re-render when data changes
  }, [costData]);

  useEffect(() => {
    console.log('timelineData state changed:', timelineData);
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
      price: '₹50/sq ft'
    },
    {
      title: 'Full Construction Package',
      description: 'Complete turnkey house construction from start to finish',
      features: ['Foundation to Roof', 'Quality Materials', 'Skilled Workers', 'Project Management'],
      price: '₹2,200/sq ft'
    },
    {
      title: 'Construction Consultation',
      description: 'Professional advice for your construction project',
      features: ['Site Analysis', 'Material Selection', 'Cost Estimation', 'Timeline Planning'],
      price: '₹150/hour'
    }
  ];

  const designProcess = [
    { step: 1, title: 'Initial Consultation', description: 'Discuss your vision and requirements' },
    { step: 2, title: '3D Design Creation', description: 'Create detailed 3D models and floor plans' },
    { step: 3, title: 'Review & Revisions', description: 'Review designs and make necessary changes' },
    { step: 4, title: 'Final Approval', description: 'Approve final designs and construction plans' },
    { step: 5, title: 'Construction Phase', description: 'Begin construction with regular updates' },
    { step: 6, title: 'Project Completion', description: 'Final inspection and handover' }
  ];

  const portfolioItems = [
    {
      title: 'Modern Villa - Lalitpur',
      area: '2500 sq ft',
      type: '3D Design + Construction',
      image: 'placeholder',
      description: 'Contemporary design with traditional elements'
    },
    {
      title: 'Traditional House - Bhaktapur',
      area: '1800 sq ft',
      type: 'Full Package',
      image: 'placeholder',
      description: 'Classic Newari architecture with modern amenities'
    },
    {
      title: 'Commercial Building - Kathmandu',
      area: '4000 sq ft',
      type: 'Construction',
      image: 'placeholder',
      description: 'Multi-story commercial complex'
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
      <section className="bg-gradient-diagonal text-white py-20">
        <div className="container-custom">
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
                            <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
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

              {/* Design Process */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                    Our Design Process
                  </h2>
                  <p className="text-xl text-gray-600">
                    A systematic approach to bring your vision to reality
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {designProcess.map((process, index) => (
                    <motion.div 
                      key={index}
                      className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {process.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {process.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{process.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Our Portfolio
                </h2>
                <p className="text-xl text-gray-600">
                  Showcase of our completed projects
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="card hover:shadow-custom transition-all duration-300"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="space-y-4">
                      {/* Placeholder Image */}
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <FaHome className="w-12 h-12 text-gray-500" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{item.area}</span>
                          <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>

                      <button className="btn-outline w-full">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
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
                    console.log('DesignConstruction received data:', data);
                    console.log('Cost estimation:', data.costEstimation);
                    console.log('Timeline data:', data.timeline);
                    console.log('Setting costData to:', data.costEstimation);
                    console.log('Setting timelineData to:', data.timeline);
                    setCostData(data.costEstimation);
                    setTimelineData(data.timeline);
                    
                    // Auto-switch to calculator tab to show results
                    setActiveTab('calculator');
                    
                    toast.success('Results updated! Check below.');
                    
                    // Force re-render check
                    setTimeout(() => {
                      console.log('After setState - costData:', costData);
                      console.log('After setState - timelineData:', timelineData);
                    }, 100);
                  }}
                />

                {/* Debug Info */}
                <div className="mt-4 p-4 bg-yellow-100 rounded">
                  <p>Debug Info:</p>
                  <p>costData: {costData ? 'Present' : 'None'}</p>
                  <p>timelineData: {timelineData ? 'Present' : 'None'}</p>
                  {costData && <p>Total Cost: ₹{costData.totalCost}</p>}
                  <button 
                    onClick={() => {
                      // Test data
                      const testData = {
                        totalCost: 5000000,
                        ratePerSqFt: 2000,
                        pieChartData: [
                          { name: 'Materials', value: 60, amount: 3000000, color: '#8884d8' },
                          { name: 'Labor', value: 30, amount: 1500000, color: '#82ca9d' },
                          { name: 'Others', value: 10, amount: 500000, color: '#ffc658' }
                        ]
                      };
                      setCostData(testData);
                      
                      const testTimeline = {
                        projectInfo: { totalDuration: 365 },
                        phases: [
                          { name: 'Foundation', duration: 30, start: '2025-01-01', end: '2025-01-31' },
                          { name: 'Structure', duration: 60, start: '2025-02-01', end: '2025-04-01' }
                        ]
                      };
                      setTimelineData(testTimeline);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Test Set Data
                  </button>
                </div>

                {/* Enhanced Results Debug */}
                <div className="mt-8 p-4 bg-gray-100 border rounded">
                  <h3 className="text-lg font-bold text-gray-800">🔍 Debug Info</h3>
                  <p>costData exists: {costData ? 'YES' : 'NO'}</p>
                  <p>timelineData exists: {timelineData ? 'YES' : 'NO'}</p>
                  {costData && (
                    <div>
                      <p>costData.pieChartData exists: {costData.pieChartData ? 'YES' : 'NO'}</p>
                      <p>costData.pieChartData length: {costData.pieChartData?.length || 0}</p>
                      <p>Object keys: {Object.keys(costData).join(', ')}</p>
                    </div>
                  )}
                </div>

                {/* Simple Results Test */}
                {costData && (
                  <div className="mt-8 p-4 bg-green-100 border border-green-400 rounded">
                    <h3 className="text-lg font-bold text-green-800">✅ Results Available!</h3>
                    <p>Total Cost: ₹{costData.totalCost?.toLocaleString()}</p>
                    <p>Rate per sq ft: ₹{costData.ratePerSqFt}</p>
                    <p>Quality: {costData.quality}</p>
                  </div>
                )}

                {timelineData && (
                  <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
                    <h3 className="text-lg font-bold text-blue-800">✅ Timeline Available!</h3>
                    <p>Total Duration: {timelineData.projectInfo?.totalDuration} days</p>
                    <p>Phases: {timelineData.phases?.length}</p>
                  </div>
                )}

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
