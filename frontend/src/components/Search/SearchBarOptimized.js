import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaTimes, 
  FaCube, 
  FaTools, 
  FaImages, 
  FaEnvelope, 
  FaCalculator,
  FaCalendarAlt,
  FaHome,
  FaArrowRight
} from 'react-icons/fa';

// Debounce hook for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar = ({ isCompact = false, onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce the search query for performance
  const debouncedQuery = useDebounce(query, 200);

  // Optimized search database - minimal data for better performance
  const searchData = useMemo(() => [
    {
      id: 1,
      title: 'Home',
      description: 'Main page with all services overview',
      keywords: ['home', 'main', 'overview', 'diagonal enterprises'],
      path: '/',
      icon: FaHome,
      category: 'Navigation'
    },
    {
      id: 2,
      title: '3D Design & Visualization',
      description: 'Professional 3D architectural design services',
      keywords: ['3d', 'design', 'visualization', 'architecture', 'modeling', 'render', 'floor plans'],
      path: '/design-construction',
      icon: FaCube,
      category: 'Design Services'
    },
    {
      id: 3,
      title: 'House Construction',
      description: 'Complete house construction services',
      keywords: ['construction', 'house', 'building', 'turnkey', 'foundation', 'contractor'],
      path: '/design-construction',
      icon: FaCube,
      category: 'Construction Services'
    },
    {
      id: 4,
      title: 'Repair & Maintenance',
      description: 'Professional repair and maintenance services',
      keywords: ['repair', 'maintenance', 'plumbing', 'electrical', 'ac', 'fix', 'service'],
      path: '/repair-maintenance',
      icon: FaTools,
      category: 'Repair Services'
    },
    {
      id: 5,
      title: 'Cost Calculator',
      description: 'Calculate construction and repair costs',
      keywords: ['cost', 'calculator', 'estimate', 'price', 'budget'],
      path: '/design-construction?tab=calculator',
      icon: FaCalculator,
      category: 'Tools'
    },
    {
      id: 6,
      title: 'Book Appointment',
      description: 'Schedule consultation or service',
      keywords: ['book', 'appointment', 'schedule', 'consultation', 'meeting'],
      path: '/design-construction?tab=booking',
      icon: FaCalendarAlt,
      category: 'Services'
    },
    {
      id: 7,
      title: 'Portfolio Gallery',
      description: 'View completed projects',
      keywords: ['portfolio', 'gallery', 'projects', 'work', 'showcase'],
      path: '/portfolio',
      icon: FaImages,
      category: 'Portfolio'
    },
    {
      id: 8,
      title: 'Contact Us',
      description: 'Get in touch with our team',
      keywords: ['contact', 'phone', 'email', 'address', 'support'],
      path: '/contact',
      icon: FaEnvelope,
      category: 'Contact'
    }
  ], []);

  // Optimized filter function
  const filterResults = useCallback((searchQuery) => {
    if (searchQuery.length < 2) return [];

    const queryLower = searchQuery.toLowerCase();
    const results = searchData.filter(item => {
      return item.title.toLowerCase().includes(queryLower) ||
             item.description.toLowerCase().includes(queryLower) ||
             item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower));
    });

    return results.slice(0, 5); // Limit results
  }, [searchData]);

  // Update filtered results when query changes
  useEffect(() => {
    setFilteredResults(filterResults(debouncedQuery));
  }, [debouncedQuery, filterResults]);

  // Handle result selection
  const handleResultClick = useCallback((result) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
    if (onClose) onClose();
  }, [navigate, onClose]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      handleResultClick(filteredResults[0]);
    }
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && inputRef.current && !isCompact) {
      inputRef.current.focus();
    }
  }, [isOpen, isCompact]);

  const inputClasses = isCompact
    ? "w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300"
    : "w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300";

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isCompact ? 'text-white/60 w-4 h-4' : 'text-gray-400 w-5 h-5'
          }`} />
          <input
            ref={inputRef}
            type="text"
            placeholder={isCompact ? "Search services..." : "Search for services, repair, construction..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className={inputClasses}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilteredResults([]);
                setIsOpen(false);
              }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isCompact ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'
              } transition-colors`}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 ${
              isCompact ? 'max-h-64' : 'max-h-80'
            } overflow-y-auto`}
          >
            {filteredResults.map((result, index) => {
              const IconComponent = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {result.title}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {result.description}
                      </p>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                        {result.category}
                      </span>
                    </div>
                    <FaArrowRight className="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
