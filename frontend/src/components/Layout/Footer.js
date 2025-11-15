import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaCube,
  FaTools,
  FaHome,
  FaArrowRight
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: '3D Design', href: '/design-construction', icon: FaCube },
    { name: 'Repair Services', href: '/repair-maintenance', icon: FaTools },
    { name: 'Contact Us', href: '/contact', icon: FaEnvelope },
    {name: 'careers', href: '/careers', icon: FaHome },
  ];

  const services = [
    '3D Design & Visualization',
    'House Construction',
    'Plumbing Services',
    'AC Installation & Repair',
    'Home Remodeling',
    'Waterproofing Solutions',
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-diagonal rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold">Diagonal Sewa</h2>
                  <p className="text-sm text-gray-400">Construction & 3D Design</p>
                    <p className="text-sm text-gray-400">Repair & Maintenance</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Professional 3D design visualization, turnkey house construction, 
                and comprehensive repair services in Nepal. Building your dreams 
                with quality and precision.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <button
                  onClick={() => window.open("https://www.facebook.com/profile.php?id=100076428225278", "_blank")}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.open("https://www.instagram.com/diagonalgroup/", "_blank")}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.open("https://www.facebook.com/profile.php?id=100076428225278", "_blank")}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-semibold">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                      <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-semibold">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-heading font-semibold">Contact Info</h3>
                    
                    <div className="space-y-4">
                    <a
                      href="https://www.google.com/maps/place/Diagonal+Group/@27.6715447,85.3388551,668m/data=!3m1!1e3!4m14!1m7!3m6!1s0x39eb1943930ad0dd:0x3141b7d0ce03519d!2sDiagonal+Group!8m2!3d27.6715447!4d85.34143!16s%2Fg%2F11j5zhqckt!3m5!1s0x39eb1943930ad0dd:0x3141b7d0ce03519d!8m2!3d27.6715447!4d85.34143!16s%2Fg%2F11j5zhqckt?entry=ttu&g_ep=EgoyMDI1MDgwMy4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 group cursor-pointer"
                    >
                      <FaMapMarkerAlt className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0 group-hover:text-primary-300 transition-colors duration-200" />
                      <div>
                      <p className="text-gray-300 group-hover:text-white transition-colors duration-200">Balkumari, Lalitpur</p>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-200">Nepal</p>
                      </div>
                    </a>

                    <div className="flex items-center space-x-3">
                      <FaPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                      <div>
                      <p className="text-gray-300">9801890011</p>
                      <p className="text-gray-400 text-sm">015201768</p>
                      </div>
                    </div>

                    <a
                      href="mailto:diagonalsewa@gmail.com"
                      className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 group"
                    >
                      <FaEnvelope className="w-5 h-5 text-primary-400 flex-shrink-0 group-hover:text-primary-300 transition-colors duration-200" />
                      <p className="text-gray-300 group-hover:text-white transition-colors duration-200">diagonalsewa@gmail.com</p>
                    </a>
                  </div>

                  {/* Business Hours */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Business Hours</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Sun - Fri: 10:00 AM - 6:00 PM</p>
                  <p>Saturday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-heading font-semibold">Stay Updated</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest construction tips, project updates, and special offers.
            </p>
            
            <div className="max-w-md mx-auto flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Diagonal Sewa. All rights reserved.
            </p>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
