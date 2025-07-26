import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaCube, 
  FaTools, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: '3D Design & Construction', href: '/design-construction', icon: FaCube },
    { name: 'Repair & Maintenance', href: '/repair-maintenance', icon: FaTools },
    { name: 'Contact', href: '/contact', icon: FaEnvelope },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-diagonal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-gray-900">Diagonal</h1>
              <p className="text-xs text-gray-600">Construction</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <FaPhone className="w-3 h-3" />
                <span>9851023395</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaMapMarkerAlt className="w-3 h-3" />
                <span>Balkumari, Lalitpur</span>
              </div>
            </div>
            <Link
              to="/design-construction"
              className="btn-primary"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Contact Info */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600">
                  <FaPhone className="w-4 h-4" />
                  <span>9851023395 / 015201768</span>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600">
                  <FaEnvelope className="w-4 h-4" />
                  <span>info@diagonal.com</span>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>Balkumari, Lalitpur</span>
                </div>
                <div className="px-4">
                  <Link
                    to="/design-construction"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
