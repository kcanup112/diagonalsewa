import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaCalculator, 
  FaHome, 
  FaChartPie,
  FaCog,
  FaSpinner
} from 'react-icons/fa';

import { calculatorService } from '../../services';
import { useApp } from '../../context/AppContext';

const CostCalculator = ({ onCalculationComplete = null }) => {
  const { setLoading } = useApp();
  
  const [formData, setFormData] = useState({
    plinth_area: '',
    floors: '1',
    quality: 'standard',
    project_type: 'residential'
  });

  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const qualityOptions = [
    { 
      value: 'basic', 
      label: 'Basic Quality', 
      description: 'Standard materials, basic finishing',
      multiplier: '0.8x',
      rate: '₹1,800/sq ft'
    },
    { 
      value: 'standard', 
      label: 'Standard Quality', 
      description: 'Good quality materials, standard finishing',
      multiplier: '1.0x',
      rate: '₹2,200/sq ft'
    },
    { 
      value: 'premium', 
      label: 'Premium Quality', 
      description: 'High-quality materials, premium finishing',
      multiplier: '1.3x',
      rate: '₹2,800/sq ft'
    },
    { 
      value: 'luxury', 
      label: 'Luxury Quality', 
      description: 'Top-tier materials, luxury finishing',
      multiplier: '1.8x',
      rate: '₹3,500/sq ft'
    }
  ];

  const floorOptions = [
    { value: '1', label: '1 Floor', description: 'Single story' },
    { value: '1.5', label: '1.5 Floors', description: 'Ground + half upper floor' },
    { value: '2', label: '2 Floors', description: 'Ground + first floor' },
    { value: '2.5', label: '2.5 Floors', description: 'Ground + first + half second floor' },
    { value: '3', label: '3 Floors', description: 'Ground + two upper floors' },
    { value: '3.5', label: '3.5 Floors', description: 'Ground + two upper + half third floor' },
    { value: '4', label: '4 Floors', description: 'Ground + three upper floors' },
    { value: '4.5', label: '4.5 Floors', description: 'Ground + three upper + half fourth floor' },
    { value: '5', label: '5 Floors', description: 'Ground + four upper floors' }
  ];

  const projectTypes = [
    { 
      value: 'residential', 
      label: 'Residential House', 
      description: 'Single/multi-family homes'
    },
    { 
      value: 'commercial', 
      label: 'Commercial Building', 
      description: 'Office, retail, or mixed-use'
    },
    { 
      value: 'villa', 
      label: 'Villa/Bungalow', 
      description: 'Luxury residential with premium features'
    },
    { 
      value: 'renovation', 
      label: 'Renovation Project', 
      description: 'Remodeling existing structure'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Area validation
    if (!formData.plinth_area) {
      newErrors.plinth_area = 'Plinth area is required';
    } else {
      const area = parseFloat(formData.plinth_area);
      if (isNaN(area) || area <= 0) {
        newErrors.plinth_area = 'Please enter a valid area greater than 0';
      } else if (area > 50000) {
        newErrors.plinth_area = 'Area cannot exceed 50,000 sq ft';
      } else if (area < 100) {
        newErrors.plinth_area = 'Minimum area should be 100 sq ft';
      }
    }

    // Floors validation
    if (!formData.floors) {
      newErrors.floors = 'Number of floors is required';
    } else {
      const floors = parseFloat(formData.floors);
      if (isNaN(floors) || floors <= 0) {
        newErrors.floors = 'Please select a valid number of floors';
      } else if (floors > 5) {
        newErrors.floors = 'Maximum 5 floors allowed';
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

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsCalculating(true);
    setLoading(true);

    try {
      const calculationData = {
        plinth_area: parseFloat(formData.plinth_area),
        floors: parseFloat(formData.floors),
        quality: formData.quality,
        project_type: formData.project_type
      };

      console.log('Sending calculation data:', calculationData);
      const response = await calculatorService.calculateCost(calculationData);
      console.log('Received response:', response);

      if (response.success) {
        toast.success('Cost calculation completed successfully!');
        
        if (onCalculationComplete) {
          console.log('onCalculationComplete exists:', typeof onCalculationComplete);
          console.log('Calling onCalculationComplete with:', response.data);
          try {
            onCalculationComplete(response.data);
            console.log('onCalculationComplete called successfully');
          } catch (callbackError) {
            console.error('Error in onCalculationComplete callback:', callbackError);
          }
        } else {
          console.log('onCalculationComplete is not provided');
        }
      } else {
        throw new Error(response.message || 'Failed to calculate cost');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack,
        errors: error.errors
      });
      
      if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.errors.forEach(err => {
          backendErrors[err.path || err.param] = err.msg;
        });
        setErrors(backendErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error(error.message || 'Failed to calculate cost. Please try again.');
      }
    } finally {
      setIsCalculating(false);
      setLoading(false);
    }
  };

  const getQuickEstimate = () => {
    const area = parseFloat(formData.plinth_area);
    const floors = parseFloat(formData.floors);
    if (isNaN(area) || area <= 0 || isNaN(floors) || floors <= 0) return null;

    const baseRates = {
      basic: 1800,
      standard: 2200,
      premium: 2800,
      luxury: 3500
    };

    const rate = baseRates[formData.quality] || baseRates.standard;
    const totalArea = area * floors;
    const estimatedCost = totalArea * rate;

    return {
      cost: estimatedCost,
      rate: rate,
      totalArea: totalArea
    };
  };

  const quickEstimate = getQuickEstimate();

  return (
    <div className="space-y-8">
      {/* Calculator Form */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
            <FaCalculator className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Construction Cost Calculator
            </h3>
          </div>

          {/* Plinth Area Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plinth Area (Square Feet) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="plinth_area"
                value={formData.plinth_area}
                onChange={handleInputChange}
                className={`input-field pr-16 ${errors.plinth_area ? 'border-red-500' : ''}`}
                placeholder="Enter area in sq ft"
                min="100"
                max="50000"
                step="1"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">sq ft</span>
              </div>
            </div>
            {errors.plinth_area && (
              <p className="text-red-500 text-sm mt-1">{errors.plinth_area}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Minimum: 100 sq ft, Maximum: 50,000 sq ft
            </p>
          </div>

          {/* Number of Floors Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Floors *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {floorOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none transition-all duration-200 ${
                    formData.floors === option.value
                      ? 'border-accent-600 bg-accent-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="floors"
                    value={option.value}
                    checked={formData.floors === option.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <div className={`font-medium ${
                          formData.floors === option.value ? 'text-accent-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-xs ${
                          formData.floors === option.value ? 'text-accent-700' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {formData.floors === option.value && (
                      <div className="text-accent-600">
                        <FaHome className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.floors && (
              <p className="text-red-500 text-sm mt-2">{errors.floors}</p>
            )}
          </div>

          {/* Quality Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quality Level *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {qualityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all duration-200 ${
                    formData.quality === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="quality"
                    value={option.value}
                    checked={formData.quality === option.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <div className={`font-medium ${
                          formData.quality === option.value ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`${
                          formData.quality === option.value ? 'text-primary-700' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {option.rate} • {option.multiplier}
                        </div>
                      </div>
                    </div>
                    {formData.quality === option.value && (
                      <div className="text-primary-600">
                        <FaChartPie className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Project Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projectTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all duration-200 ${
                    formData.project_type === type.value
                      ? 'border-secondary-600 bg-secondary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="project_type"
                    value={type.value}
                    checked={formData.project_type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <div className={`font-medium ${
                          formData.project_type === type.value ? 'text-secondary-900' : 'text-gray-900'
                        }`}>
                          {type.label}
                        </div>
                        <div className={`${
                          formData.project_type === type.value ? 'text-secondary-700' : 'text-gray-500'
                        }`}>
                          {type.description}
                        </div>
                      </div>
                    </div>
                    {formData.project_type === type.value && (
                      <div className="text-secondary-600">
                        <FaHome className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Estimate Preview */}
          {quickEstimate && (
            <motion.div 
              className="bg-gray-50 rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-medium text-gray-900 mb-2">Quick Estimate</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plinth Area:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {parseFloat(formData.plinth_area).toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Number of Floors:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formData.floors}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Built-up Area:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {quickEstimate.totalArea.toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-gray-600">Rate per sq ft:</span>
                  <span className="text-sm font-medium text-gray-800">
                    ₹{quickEstimate.rate.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Estimated Cost:</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{quickEstimate.cost.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is a rough estimate. Click "Calculate Detailed Cost" for breakdown and timeline.
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCalculating}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isCalculating ? (
              <>
                <FaSpinner className="w-5 h-5 animate-spin" />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <FaCog className="w-5 h-5" />
                <span>Calculate Detailed Cost & Timeline</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Booking Link */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <div className="text-center space-y-4">
            <FaHome className="w-16 h-16 text-primary-600 mx-auto" />
            <h4 className="text-xl font-semibold text-gray-900">
              Ready to Start Your Project?
            </h4>
            <p className="text-gray-600 max-w-md mx-auto">
              Get a detailed quote and professional consultation for your construction project. 
              Book an appointment with our expert team today.
            </p>
            <button
              onClick={() => {
                // Try multiple ways to navigate to booking
                const bookingSection = document.querySelector('#booking');
                const bookingTab = document.querySelector('[data-tab="booking"]');
                
                if (bookingSection) {
                  // If booking section exists, scroll to it
                  bookingSection.scrollIntoView({ behavior: 'smooth' });
                } else if (bookingTab) {
                  // If booking tab exists, click it
                  bookingTab.click();
                } else {
                  // Navigate to design-construction page with booking tab
                  window.location.href = '/design-construction?tab=booking';
                }
              }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FaHome className="w-5 h-5" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div 
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Prices are estimates based on current market rates in Nepal</li>
          <li>• Actual costs may vary based on location, site conditions, and material availability</li>
          <li>• Final pricing will be provided after site inspection and detailed consultation</li>
          <li>• Contact us for a personalized quote tailored to your specific requirements</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default CostCalculator;
