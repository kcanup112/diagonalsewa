import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaCube, 
  FaTools, 
  FaImages,
  FaEnvelope,
  FaBuilding,
  FaUsers
} from 'react-icons/fa';
import DiagonalLogo from '../../assets/images/diagonal-logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Transform values for scroll-based animations
  const navbarY = useTransform(scrollY, [0, 100], [0, -10]);
  const navbarOpacity = useTransform(scrollY, [0, 50], [1, 0.95]);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: '3D Design & Construction', href: '/design-construction', icon: FaCube },
    { name: 'Repair & Maintenance', href: '/repair-maintenance', icon: FaTools },
    { name: 'Real Estate', href: 'https://www.diagonalhomes.com', icon: FaBuilding, external: true },
    { name: 'Gallery', href: '/gallery', icon: FaImages },
    { name: 'About Team', href: '/about-team', icon: FaUsers },
    { name: 'Contact', href: '#footer', icon: FaEnvelope, scroll: true },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (item) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.scroll) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // For internal links, let React Router handle it
  };

  // Animation variants
  const navbarVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 360,
      transition: { 
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const linkVariants = {
    initial: { y: 0 },
    hover: { 
      y: -2,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav 
      variants={navbarVariants}
      initial="initial"
      animate="animate"
      style={{ y: navbarY, opacity: navbarOpacity }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-white/20' 
          : 'bg-white shadow-lg'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Company Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="relative w-12 h-12 flex items-center justify-center overflow-hidden"
            >
              <img 
                src={DiagonalLogo} 
                alt="Diagonal Enterprises Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="ml-1"
            >
              <motion.h1 
                className="text-2xl font-heading font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 leading-tight"
                whileHover={{ scale: 1.05 }}
              >
                Diagonal Enterprises
              </motion.h1>
              <motion.p 
                className="text-sm text-gray-600 group-hover:text-primary-500 transition-colors duration-200 -mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Infrastructure Construction
              </motion.p>
            </motion.div>
          </Link>

          {/* Animated Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
                custom={index}
              >
                {item.external || item.scroll ? (
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group ${
                      isActive(item.href) && !item.external && !item.scroll
                        ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/25'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'
                    }`}
                  >
                    {/* Background glow effect for active item */}
                    {isActive(item.href) && !item.external && !item.scroll && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon with animation */}
                    <motion.div
                      className="relative z-10"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={`w-4 h-4 ${isActive(item.href) && !item.external && !item.scroll ? 'text-white' : ''}`} />
                    </motion.div>
                    
                    {/* Text with slide effect */}
                    <motion.span 
                      className="relative z-10"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                    
                    {/* External link indicator */}
                    {item.external && (
                      <motion.div
                        className="relative z-10 ml-1"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.div>
                    )}
                    
                    {/* Hover underline effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: isActive(item.href) && !item.external && !item.scroll ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/25'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'
                    }`}
                  >
                    {/* Background glow effect for active item */}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon with animation */}
                    <motion.div
                      className="relative z-10"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'text-white' : ''}`} />
                    </motion.div>
                    
                    {/* Text with slide effect */}
                    <motion.span 
                      className="relative z-10"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                    
                    {/* Hover underline effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: isActive(item.href) ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Animated Mobile menu button */}
          <motion.button
            onClick={toggleMenu}
            className="lg:hidden relative p-3 rounded-xl text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-200"
            />
            
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes className="w-6 h-6 relative z-10" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars className="w-6 h-6 relative z-10" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-primary-500 opacity-0"
              animate={isOpen ? { 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={mobileItemVariants}
                  custom={index}
                >
                  {item.external || item.scroll ? (
                    <button
                      onClick={() => {
                        handleNavClick(item);
                        setIsOpen(false);
                      }}
                      className={`relative flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 group overflow-hidden w-full text-left ${
                        isActive(item.href) && !item.external && !item.scroll
                          ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'
                      }`}
                    >
                      {/* Animated background for active item */}
                      {isActive(item.href) && !item.external && !item.scroll && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500"
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Icon with animation */}
                      <motion.div
                        className="relative z-10"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className={`w-5 h-5 ${isActive(item.href) && !item.external && !item.scroll ? 'text-white' : ''}`} />
                      </motion.div>
                      
                      {/* Text with slide effect */}
                      <motion.span 
                        className="relative z-10"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                      
                      {/* External link indicator */}
                      {item.external && (
                        <motion.div
                          className="relative z-10 ml-1"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </motion.div>
                      )}
                      
                      {/* Arrow indicator */}
                      <motion.div
                        className={`ml-auto relative z-10 ${isActive(item.href) && !item.external && !item.scroll ? 'text-white' : 'text-primary-500'}`}
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.div>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`relative flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 group overflow-hidden ${
                        isActive(item.href)
                          ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'
                      }`}
                    >
                      {/* Animated background for active item */}
                      {isActive(item.href) && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500"
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Icon with animation */}
                      <motion.div
                        className="relative z-10"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : ''}`} />
                      </motion.div>
                      
                      {/* Text with slide effect */}
                      <motion.span 
                        className="relative z-10"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                      
                      {/* Arrow indicator */}
                      <motion.div
                        className={`ml-auto relative z-10 ${isActive(item.href) ? 'text-white' : 'text-primary-500'}`}
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
