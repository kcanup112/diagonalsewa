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
  const [isNavHovered, setIsNavHovered] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Transform values for scroll-based animations
  const navbarY = useTransform(scrollY, [0, 100], [0, -10]);
  const navbarOpacity = useTransform(scrollY, [0, 50], [1, 0.95]);
  
  // Handle scroll effects
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'Home', 
      shortName: 'Home', 
      href: '/', 
      icon: FaHome 
    },
    { 
      name: 'Repair & Maintenance', 
      shortName: 'Repair', 
      href: '/repair-maintenance', 
      icon: FaTools 
    },
    { 
      name: '3D Design & Construction', 
      shortName: 'Design', 
      href: '/design-construction', 
      icon: FaCube
    },
    { 
      name: 'Real Estate', 
      shortName: 'Estate', 
      href: 'https://www.diagonalhomes.com', 
      icon: FaBuilding, 
      external: true 
    },
    { 
      name: 'Gallery', 
      shortName: 'Gallery', 
      href: '/gallery', 
      icon: FaImages 
    },
    { 
      name: 'About Team', 
      shortName: 'About', 
      href: '/about-team', 
      icon: FaUsers 
    },
    { 
      name: 'Contact', 
      shortName: 'Contact', 
      href: '/contact', 
      icon: FaEnvelope 
    },
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
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-white/20' 
          : 'bg-white shadow-lg'
      }`}
    >
      <div className="max-w-full mx-auto px-4">
        <div className={`flex items-center transition-all duration-500 ${
          isScrolled && !isNavHovered ? 'justify-center py-2' : 'justify-between py-4'
        }`}>
          {/* Company Logo and Brand */}
          <motion.div
            animate={{ 
              opacity: (isScrolled && !isNavHovered) ? 0 : 1,
              x: (isScrolled && !isNavHovered) ? -100 : 0,
              scale: (isScrolled && !isNavHovered) ? 0.8 : 1
            }}
            transition={{ duration: 0.5 }}
            className={`flex-shrink-0 ${(isScrolled && !isNavHovered) ? 'absolute pointer-events-none' : ''}`}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                variants={logoVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="relative w-12 h-12 flex items-center justify-center"
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
              >
                <motion.h4 
                  className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  Diagonal Sewa
                </motion.h4>
                <motion.p 
                  className="text-base text-gray-600 group-hover:text-primary-500 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Construction & 3D Design
                  
                </motion.p>
                <motion.p 
                  className="text-base text-gray-600 group-hover:text-primary-500 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  
                  Repair & Maintenance
                </motion.p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation with Text Hide Animation */}
          <div className={`hidden lg:flex items-center transition-all duration-500 ${
            isScrolled && !isNavHovered ? 'space-x-1' : 'space-x-2'
          }`}>
            {navigation.map((item) => {
              const isItemActive = isActive(item.href);
              const showFullText = !isScrolled || isNavHovered;
              
              return (
                <motion.div key={item.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  {item.external || item.scroll ? (
                    <motion.button
                      onClick={() => handleNavClick(item)}
                      className={`relative flex items-center justify-center rounded-lg font-medium transition-all whitespace-nowrap overflow-hidden ${
                        (isScrolled && !isNavHovered) ? 'px-2 py-2 text-sm' : 'px-4 py-2.5 text-base'
                      } ${
                        isItemActive && !item.external
                          ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isItemActive && (
                        <motion.div
                          layoutId="activeNavBg"
                          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className="relative z-10 flex-shrink-0"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-5 h-5" />
                      </motion.div>
                      <motion.div
                        className="relative z-10 overflow-hidden"
                        animate={{
                          width: showFullText ? 'auto' : '0px',
                          marginLeft: showFullText ? '8px' : '0px',
                          opacity: showFullText ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <span className="flex flex-col leading-tight text-base">
                          {item.name.includes('&') || item.name.includes('3D') ? (
                            <>
                              <span className="text-xs leading-tight">{item.name.split(' ').slice(0, item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                              <span className="text-xs leading-tight">{item.name.split(' ').slice(item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                            </>
                          ) : (
                            <span className="text-base">{item.name}</span>
                          )}
                        </span>
                      </motion.div>
                      {item.external && showFullText && (
                        <motion.svg 
                          className="w-3 h-3 ml-1 relative z-10" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </motion.svg>
                      )}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: isItemActive ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`relative flex items-center justify-center rounded-lg font-medium transition-all whitespace-nowrap overflow-hidden ${
                        (isScrolled && !isNavHovered) ? 'px-2 py-2 text-sm' : 'px-4 py-2.5 text-base'
                      } ${
                        isItemActive
                          ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                      >
                        {isItemActive && (
                          <motion.div
                            layoutId="activeNavBg"
                            className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <motion.div
                          className="relative z-10 flex-shrink-0"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <item.icon className="w-5 h-5" />
                        </motion.div>
                        <motion.div
                          className="relative z-10 overflow-hidden"
                          animate={{
                            width: showFullText ? 'auto' : '0px',
                            marginLeft: showFullText ? '8px' : '0px',
                            opacity: showFullText ? 1 : 0,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <span className="flex flex-col leading-tight text-base">
                            {item.name.includes('&') || item.name.includes('3D') ? (
                              <>
                                <span className="text-xs leading-tight">{item.name.split(' ').slice(0, item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                                <span className="text-xs leading-tight">{item.name.split(' ').slice(item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                              </>
                            ) : (
                              <span className="text-base">{item.name}</span>
                            )}
                          </span>
                        </motion.div>
                      </motion.div>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: isItemActive ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaBars className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
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
                        className="relative z-10 flex flex-col leading-tight text-base"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name.includes('&') || item.name.includes('3D') ? (
                          <>
                            <span className="text-sm leading-tight">{item.name.split(' ').slice(0, item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                            <span className="text-sm leading-tight">{item.name.split(' ').slice(item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                          </>
                        ) : (
                          <span className="text-base">{item.displayName || item.name}</span>
                        )}
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
                        className="relative z-10 flex flex-col leading-tight"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name.includes('&') || item.name.includes('3D') ? (
                          <>
                            <span className="text-sm">{item.name.split(' ').slice(0, item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                            <span className="text-sm">{item.name.split(' ').slice(item.name.split(' ').indexOf('&') + 1).join(' ')}</span>
                          </>
                        ) : (
                          <span>{item.displayName || item.name}</span>
                        )}
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
