import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRupeeSign, 
  FaClock, 
  FaCalendar,
  FaDownload,
  FaPrint,
  FaShare,
  FaChartBar,
  FaHammer,
  FaHome,
  FaTruck
} from 'react-icons/fa';

const Results = ({ data, onClose }) => {
  if (!data) return null;

  const {
    calculation,
    timeline,
    breakdown,
    total_cost,
    estimated_duration,
    project_phases
  } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (months) => {
    if (months < 1) {
      const weeks = Math.ceil(months * 4);
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  const phaseIcons = {
    foundation: FaHammer,
    structure: FaHome,
    finishing: FaTruck,
    electrical: FaChartBar
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Construction Cost Estimate</h2>
            <p className="text-gray-600">Detailed breakdown and timeline</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <FaDownload className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <FaPrint className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <FaShare className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <FaRupeeSign className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600 font-medium">Total Cost</p>
                  <p className="text-2xl font-bold text-primary-900">
                    {formatCurrency(total_cost)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="card bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <FaClock className="w-8 h-8 text-secondary-600" />
                <div>
                  <p className="text-sm text-secondary-600 font-medium">Duration</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {formatDuration(estimated_duration)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="card bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <FaCalendar className="w-8 h-8 text-accent-600" />
                <div>
                  <p className="text-sm text-accent-600 font-medium">Rate per sq ft</p>
                  <p className="text-2xl font-bold text-accent-900">
                    ₹{(total_cost / calculation.plinth_area).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cost Breakdown */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(breakdown).map(([category, details]) => (
                <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {category.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-gray-600">{details.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(details.cost)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {((details.cost / total_cost) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Project Timeline */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Timeline</h3>
            <div className="space-y-4">
              {project_phases && project_phases.map((phase, index) => {
                const IconComponent = phaseIcons[phase.type] || FaHammer;
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{phase.name}</h4>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Duration: {formatDuration(phase.duration)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Cost: {formatCurrency(phase.cost)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Week {phase.start_week} - {phase.end_week}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-4">Project Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plinth Area:</span>
                  <span className="font-medium">{calculation.plinth_area} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality Level:</span>
                  <span className="font-medium capitalize">{calculation.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project Type:</span>
                  <span className="font-medium capitalize">{calculation.project_type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Rate:</span>
                  <span className="font-medium">₹{calculation.base_rate}/sq ft</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-4">Important Notes</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Prices include materials, labor, and supervision</li>
                <li>• Final costs may vary based on site conditions</li>
                <li>• Timeline assumes favorable weather conditions</li>
                <li>• Additional charges may apply for remote locations</li>
                <li>• Government approvals and permits not included</li>
              </ul>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button className="btn-primary flex-1">
              Book Consultation
            </button>
            <button className="btn-secondary flex-1">
              Request Site Visit
            </button>
            <button className="btn-outline flex-1">
              Get Detailed Quote
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Results;
