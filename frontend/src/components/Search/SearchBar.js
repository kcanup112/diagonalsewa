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
  const debouncedQuery = useDebounce(query, 150);

  // Optimized search database - reduced size for better performance
  const searchData = useMemo(() => [
    // Navigation Pages
    {
      id: 1,
      title: 'Home',
      description: 'Main page with overview of all services',
      keywords: ['home', 'main', 'overview', 'start', 'diagonal enterprises'],
      path: '/',
      icon: FaHome,
      category: 'Navigation'
    },

    // Core Services - Simplified
    {
      id: 2,
      title: '3D Design & Visualization',
      description: 'Professional 3D architectural design and visualization services',
      keywords: ['3d', 'design', 'visualization', 'architecture', 'modeling', 'render', 'floor plans', 'interior', 'exterior'],
      path: '/design-construction',
      icon: FaCube,
      category: 'Design Services'
    },
    {
      id: 3,
      title: 'House Construction',
      description: 'Complete house construction and building services',
      keywords: ['construction', 'house', 'building', 'turnkey', 'foundation', 'structural', 'contractor', 'builder'],
      path: '/design-construction',
      icon: FaCube,
      category: 'Construction Services'
    },
    {
      id: 4,
      title: 'Repair & Maintenance',
      description: 'Professional repair and maintenance services',
      keywords: ['repair', 'maintenance', 'plumbing', 'electrical', 'ac', 'hvac', 'fix', 'service'],
      path: '/repair-maintenance',
      icon: FaTools,
      category: 'Repair Services'
    },

    // Quick Actions
    {
      id: 5,
      title: 'Cost Calculator',
      description: 'Calculate construction and repair costs',
      keywords: ['cost', 'calculator', 'estimate', 'price', 'budget', 'calculate'],
      path: '/design-construction?tab=calculator',
      icon: FaCalculator,
      category: 'Tools'
    },
    {
      id: 6,
      title: 'Book Appointment',
      description: 'Schedule consultation or service appointment',
      keywords: ['book', 'appointment', 'schedule', 'consultation', 'meeting', 'service'],
      path: '/design-construction?tab=booking',
      icon: FaCalendarAlt,
      category: 'Services'
    },
    {
      id: 7,
      title: 'Portfolio Gallery',
      description: 'View our completed projects and work samples',
      keywords: ['portfolio', 'gallery', 'projects', 'work', 'completed', 'showcase'],
      path: '/portfolio',
      icon: FaImages,
      category: 'Portfolio'
    },
    {
      id: 8,
      title: 'Contact Us',
      description: 'Get in touch with our team',
      keywords: ['contact', 'reach', 'phone', 'email', 'address', 'location', 'support'],
      path: '/contact',
      icon: FaEnvelope,
      category: 'Contact'
    }
  ], []);

  // Optimized filter function with debouncing
  const filterResults = useCallback((searchQuery) => {
    if (searchQuery.length === 0) {
      return [];
    }

    const queryLower = searchQuery.toLowerCase();
    const results = searchData.filter(item => {
      // Simple string matching for better performance
      const titleMatch = item.title.toLowerCase().includes(queryLower);
      const descriptionMatch = item.description.toLowerCase().includes(queryLower);
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower)
      );
      
      return titleMatch || descriptionMatch || keywordMatch;
    });

    // Sort results by relevance
    results.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase() === queryLower;
      const bExactMatch = b.title.toLowerCase() === queryLower;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      return a.title.length - b.title.length;
    });

    return results.slice(0, 6); // Limit to 6 results for performance
  }, [searchData]);

  // Filter search results based on debounced query
  useEffect(() => {
    setFilteredResults(filterResults(debouncedQuery));
  }, [debouncedQuery, filterResults]);

  // Handle search result selection
  const handleResultClick = useCallback((result) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
    if (onClose) onClose();
  }, [navigate, onClose]);
        'rough estimate', 'detailed estimate', 'preliminary estimate', 'final estimate',
        'cost breakdown', 'line item estimate', 'quantity takeoff'
      ],
      path: '/design-construction?tab=calculator',
      icon: FaCalculator,
      category: 'Planning Tools'
    },
    {
      id: 6,
      title: 'Book Appointment',
      description: 'Schedule consultation and meetings with our team',
      keywords: [
        'book', 'appointment', 'schedule', 'consultation', 'meeting', 'booking', 'reserve', 'calendar',
        'site visit', 'consultation visit', 'free consultation', 'project discussion',
        'appointment booking', 'schedule meeting', 'book consultation', 'arrange meeting',
        'initial consultation', 'design consultation', 'construction consultation',
        'expert consultation', 'professional consultation', 'technical consultation'
      ],
      path: '/design-construction?tab=booking',
      icon: FaCalendarAlt,
      category: 'Planning Tools'
    },

    // Repair & Maintenance Services
    {
      id: 7,
      title: 'Repair & Maintenance',
      description: 'Professional repair and maintenance services for homes and buildings',
      keywords: [
        'repair', 'maintenance', 'fix', 'service', 'maintenance service', 'repair service',
        'home maintenance', 'building maintenance', 'property maintenance',
        'preventive maintenance', 'corrective maintenance', 'emergency repair',
        'maintenance contract', 'annual maintenance', 'regular maintenance'
      ],
      path: '/repair-maintenance',
      icon: FaTools,
      category: 'Maintenance Services'
    },
    {
      id: 8,
      title: 'Plumbing Services',
      description: 'Professional plumbing repair, installation and maintenance',
      keywords: [
        // Basic plumbing
        'plumbing', 'pipes', 'water', 'leak', 'drain', 'faucet', 'toilet', 'bathroom plumbing', 'kitchen plumbing',
        // Plumbing problems
        'pipe leak', 'water leak', 'blocked drain', 'clogged drain', 'running toilet', 'dripping faucet',
        'low water pressure', 'no hot water', 'burst pipe', 'frozen pipe',
        // Plumbing installations
        'pipe installation', 'fixture installation', 'water heater installation', 'shower installation',
        'sink installation', 'toilet installation', 'dishwasher installation', 'washing machine connection',
        // Plumbing maintenance
        'pipe cleaning', 'drain cleaning', 'water heater maintenance', 'plumbing inspection',
        // Emergency plumbing
        'emergency plumbing', '24 hour plumbing', 'urgent plumbing', 'plumbing emergency'
      ],
      path: '/repair-maintenance?service=plumbing',
      icon: FaTools,
      category: 'Maintenance Services'
    },
    {
      id: 9,
      title: 'AC Services',
      description: 'Air conditioning repair, installation and maintenance',
      keywords: [
        // AC basics
        'ac', 'air conditioning', 'hvac', 'cooling', 'air conditioner', 'climate control', 'ventilation',
        // AC problems
        'ac not cooling', 'ac not working', 'ac repair', 'ac maintenance', 'ac service',
        'refrigerant leak', 'compressor problem', 'fan not working', 'thermostat issue',
        // AC types
        'split ac', 'window ac', 'central ac', 'ductless ac', 'heat pump',
        // AC services
        'ac installation', 'ac cleaning', 'filter replacement', 'duct cleaning', 'ac tune-up',
        // Emergency AC
        'emergency ac repair', 'urgent ac service', '24 hour ac repair'
      ],
      path: '/repair-maintenance?service=ac',
      icon: FaTools,
      category: 'Maintenance Services'
    },
    {
      id: 10,
      title: 'Remodeling Services',
      description: 'Home remodeling, renovation and upgrade services',
      keywords: [
        // Remodeling basics
        'remodeling', 'renovation', 'remodel', 'renovate', 'update', 'modernize', 'upgrade', 'makeover',
        // Room specific remodeling
        'kitchen remodeling', 'bathroom remodeling', 'bedroom renovation', 'living room makeover',
        'basement finishing', 'attic conversion', 'garage conversion',
        // Remodeling types
        'home improvement', 'house renovation', 'property upgrade', 'structural changes',
        'addition', 'extension', 'room addition', 'second story addition',
        // Specific improvements
        'cabinet refacing', 'countertop replacement', 'tile work', 'hardwood installation',
        'window replacement', 'door installation', 'trim work', 'crown molding'
      ],
      path: '/repair-maintenance?service=remodeling',
      icon: FaTools,
      category: 'Maintenance Services'
    },
    {
      id: 11,
      title: 'Waterproofing Services',
      description: 'Professional waterproofing and moisture protection solutions',
      keywords: [
        // Waterproofing basics
        'waterproofing', 'waterproof', 'leak protection', 'moisture', 'dampness', 'sealing', 'protection',
        // Waterproofing problems
        'water damage', 'basement flooding', 'roof leak', 'wall moisture', 'foundation leak',
        'mold problem', 'humidity issue', 'condensation problem',
        // Waterproofing types
        'basement waterproofing', 'roof waterproofing', 'bathroom waterproofing', 'balcony waterproofing',
        'terrace waterproofing', 'exterior waterproofing', 'interior waterproofing',
        // Waterproofing methods
        'membrane waterproofing', 'coating waterproofing', 'injection waterproofing', 'crystalline waterproofing'
      ],
      path: '/repair-maintenance?service=waterproofing',
      icon: FaTools,
      category: 'Maintenance Services'
    },

    // Electrical Services
    {
      id: 12,
      title: 'Electrical Services',
      description: 'Professional electrical installation, repair and maintenance',
      keywords: [
        'electrical', 'electrician', 'wiring', 'electrical work', 'electrical repair',
        'power', 'electricity', 'electrical installation', 'electrical maintenance',
        'circuit', 'breaker', 'fuse', 'outlet', 'switch', 'lighting',
        'electrical panel', 'meter', 'transformer', 'generator installation',
        'electrical inspection', 'electrical safety', 'electrical upgrade'
      ],
      path: '/repair-maintenance?service=electrical',
      icon: FaTools,
      category: 'Maintenance Services'
    },

    // Portfolio & Gallery
    {
      id: 13,
      title: 'Gallery',
      description: 'View our completed projects, portfolio and work showcase',
      keywords: [
        'gallery', 'portfolio', 'projects', 'photos', 'images', 'completed work', 'showcase', 'examples',
        'before after', 'case studies', 'project gallery', 'work samples', 'construction photos',
        'design portfolio', 'project showcase', 'completed projects', 'our work', 'previous projects'
      ],
      path: '/gallery',
      icon: FaImages,
      category: 'Portfolio'
    },
    {
      id: 14,
      title: 'Project Portfolio',
      description: 'Browse our extensive project portfolio and case studies',
      keywords: [
        'project portfolio', 'case study', 'success stories', 'client work', 'featured projects',
        'residential projects', 'commercial projects', 'construction portfolio', 'design portfolio',
        'luxury homes', 'modern homes', 'traditional homes', 'custom homes'
      ],
      path: '/gallery?category=projects',
      icon: FaImages,
      category: 'Portfolio'
    },

    // Contact & Support
    {
      id: 15,
      title: 'Contact Us',
      description: 'Get in touch with our team for inquiries and support',
      keywords: [
        'contact', 'get in touch', 'reach us', 'phone', 'email', 'address', 'location', 'support',
        'customer service', 'help', 'assistance', 'inquiry', 'question', 'information',
        'office location', 'contact number', 'email address', 'contact form'
      ],
      path: '/contact',
      icon: FaEnvelope,
      category: 'Contact'
    },
    {
      id: 16,
      title: 'About Team',
      description: 'Meet our professional team and learn about our expertise',
      keywords: [
        'about', 'team', 'about us', 'our team', 'staff', 'professionals', 'experts',
        'architects', 'engineers', 'contractors', 'designers', 'experience', 'expertise',
        'company profile', 'team members', 'leadership', 'credentials', 'qualifications'
      ],
      path: '/about-team',
      icon: FaEnvelope,
      category: 'Company'
    },

    // Specialized Services
    {
      id: 17,
      title: 'Structural Engineering',
      description: 'Professional structural engineering and analysis services',
      keywords: [
        'structural', 'engineering', 'structural engineering', 'structural analysis', 'structural design',
        'foundation design', 'beam design', 'column design', 'slab design', 'steel structure',
        'concrete structure', 'earthquake resistant', 'structural safety', 'load calculation'
      ],
      path: '/design-construction?service=structural',
      icon: FaCube,
      category: 'Engineering Services'
    },
    {
      id: 18,
      title: 'Project Management',
      description: 'Professional construction project management services',
      keywords: [
        'project management', 'construction management', 'project coordination', 'site management',
        'project planning', 'timeline management', 'resource management', 'quality assurance',
        'project supervisor', 'construction supervisor', 'project execution', 'project monitoring'
      ],
      path: '/design-construction?service=management',
      icon: FaCalendarAlt,
      category: 'Management Services'
    },
    {
      id: 19,
      title: 'Landscape Design',
      description: 'Professional landscape design and outdoor space planning',
      keywords: [
        'landscape', 'landscaping', 'garden design', 'outdoor design', 'yard design',
        'garden planning', 'outdoor space', 'lawn design', 'plant selection', 'irrigation',
        'hardscaping', 'softscaping', 'patio design', 'walkway design', 'retaining wall'
      ],
      path: '/design-construction?service=landscape',
      icon: FaCube,
      category: 'Design Services'
    },

    // Materials & Supplies
    {
      id: 20,
      title: 'Construction Materials',
      description: 'Quality construction materials and supplies',
      keywords: [
        'materials', 'construction materials', 'building materials', 'supplies', 'hardware',
        'cement', 'concrete', 'steel', 'bricks', 'tiles', 'paint', 'wood', 'lumber',
        'insulation', 'roofing materials', 'flooring materials', 'electrical materials',
        'plumbing materials', 'doors', 'windows', 'fixtures', 'hardware supplies'
      ],
      path: '/design-construction?tab=materials',
      icon: FaTools,
      category: 'Materials'
    },

    // Commercial Services
    {
      id: 21,
      title: 'Commercial Construction',
      description: 'Professional commercial building and construction services',
      keywords: [
        'commercial', 'commercial construction', 'office building', 'retail construction',
        'warehouse construction', 'industrial construction', 'commercial remodeling',
        'tenant improvement', 'commercial renovation', 'business construction'
      ],
      path: '/design-construction?type=commercial',
      icon: FaCube,
      category: 'Commercial Services'
    },

    // Emergency Services
    {
      id: 22,
      title: 'Emergency Services',
      description: '24/7 emergency repair and maintenance services',
      keywords: [
        'emergency', '24 hour', '24/7', 'urgent', 'emergency repair', 'emergency service',
        'emergency plumbing', 'emergency electrical', 'emergency ac', 'water damage',
        'flood damage', 'storm damage', 'urgent repair', 'immediate service'
      ],
      path: '/repair-maintenance?type=emergency',
      icon: FaTools,
      category: 'Emergency Services'
    }
  ];

  // Filter search results based on query
  useEffect(() => {
    if (query.length === 0) {
      setFilteredResults([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const results = searchData.filter(item => {
      // Check if query matches title, description, or keywords
      const titleMatch = item.title.toLowerCase().includes(queryLower);
      const descriptionMatch = item.description.toLowerCase().includes(queryLower);
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower)
      );
      
      return titleMatch || descriptionMatch || keywordMatch;
    });

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase() === queryLower || 
                         a.keywords.some(k => k.toLowerCase() === queryLower);
      const bExactMatch = b.title.toLowerCase() === queryLower || 
                         b.keywords.some(k => k.toLowerCase() === queryLower);
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // Secondary sort by title length (shorter titles first for more specific results)
      return a.title.length - b.title.length;
    });

    setFilteredResults(results.slice(0, 8)); // Limit to 8 results
  }, [query]);

  // Handle search result selection
  const handleResultClick = (result) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      handleResultClick(filteredResults[0]);
    }
  };

  // Handle quick search events
  useEffect(() => {
    const handleQuickSearch = (event) => {
      setQuery(event.detail);
      setIsOpen(true);
    };

    window.addEventListener('quickSearch', handleQuickSearch);
    return () => window.removeEventListener('quickSearch', handleQuickSearch);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current && !isCompact) {
      inputRef.current.focus();
    }
  }, [isOpen, isCompact]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
      // Escape to close search
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Group results by category
  const groupedResults = filteredResults.reduce((acc, result) => {
    const category = result.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {});

  if (isCompact) {
    return (
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search services, pages..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white caret-gray-900"
            onFocus={() => setIsOpen(true)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (query.length > 0 || filteredResults.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-[9999]"
            >
                {filteredResults.length > 0 ? (
                  <div className="p-2">
                    {Object.entries(groupedResults).map(([category, results]) => (
                      <div key={category} className="mb-2 last:mb-0">
                        <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {category}
                        </div>
                        {results.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <result.icon className="w-4 h-4 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {result.description}
                              </div>
                            </div>
                            <FaArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : query.length > 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <FaSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No results found for "{query}"</p>
                    <p className="text-sm text-gray-500 truncate">
                      Try searching for "3D design", "plumbing", "electrical", "waterproofing", "interior design", etc.
                    </p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
      >
        <FaSearch className="w-4 h-4" />
        <span className="hidden md:inline text-sm">Search</span>
        <span className="hidden lg:inline text-xs text-gray-400 ml-2 px-2 py-1 bg-gray-100 rounded border">
          ⌘K
        </span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Search</h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search for services, pages, or features..."
                      className="w-full pl-12 pr-20 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white caret-gray-900"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      ESC
                    </div>
                  </form>

                  {/* Quick suggestions when no query */}
                  {query.length === 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          '3D Design', 
                          'Cost Calculator', 
                          'Book Appointment', 
                          'Plumbing', 
                          'AC Repair', 
                          'Waterproofing',
                          'Interior Design',
                          'Construction',
                          'Emergency Repair',
                          'Remodeling',
                          'Electrical',
                          'Project Management'
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setQuery(suggestion)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    <div className="p-4">
                      {Object.entries(groupedResults).map(([category, results]) => (
                        <div key={category} className="mb-6 last:mb-0">
                          <div className="px-2 py-1 text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                            {category}
                          </div>
                          <div className="space-y-1">
                            {results.map((result) => (
                              <button
                                key={result.id}
                                onClick={() => handleResultClick(result)}
                                className="w-full flex items-center space-x-4 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors duration-150 group"
                              >
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                                  <result.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-base font-medium text-gray-900 mb-1">
                                    {result.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {result.description}
                                  </div>
                                </div>
                                <FaArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : query.length > 0 ? (
                    <div className="p-8 text-center">
                      <FaSearch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No results found</h4>
                      <p className="text-gray-500 mb-4">
                        We couldn't find anything matching "{query}"
                      </p>
                      <div className="text-sm text-gray-400">
                        <p>Try searching for:</p>
                        <ul className="mt-2 space-y-1">
                          <li>• "3D design", "visualization", "interior design"</li>
                          <li>• "construction", "building", "house construction"</li>
                          <li>• "plumbing", "AC", "electrical", "waterproofing"</li>
                          <li>• "repair", "maintenance", "emergency service"</li>
                          <li>• "cost calculator", "booking", "consultation"</li>
                          <li>• "remodeling", "renovation", "project management"</li>
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
