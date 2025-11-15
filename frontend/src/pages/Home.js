import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCube, 
  FaTools, 
  FaCalendarAlt,
  FaCheck,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';

import { galleryService } from '../services';
import { preloadImages, CRITICAL_IMAGES } from '../utils/imageOptimization';

// Lazy load components
const SearchBar = lazy(() => import('../components/Search/SearchBarOptimized'));

// Preload critical images on component mount
const useImagePreloading = () => {
  useEffect(() => {
    // Preload critical images after a short delay to prioritize initial render
    const timeoutId = setTimeout(() => {
      preloadImages(CRITICAL_IMAGES);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);
};

// Optimized Image Slideshow Component with lazy loading
const ImageSlideshow = React.memo(() => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadedStates, setImageLoadedStates] = useState({});

  // Optimized default images with smaller placeholder sizes
  const defaultImages = React.useMemo(() => [
    { 
      id: 1, 
      url: '/images/gallery/living.jpg', 
      title: 'Quality Construction',
      description: 'Building with precision and care',
      alt: 'Living room construction showcase'
    },
    { 
      id: 2, 
      url: '/images/gallery/white.jpg', 
      title: 'Expert Craftsmanship',
      description: 'Professional results you can trust',
      alt: 'White interior design showcase'
    },
    { 
      id: 3, 
      url: '/images/gallery/hero.jpg', 
      title: 'Professional Design',
      description: 'Modern architectural excellence',
      alt: 'Hero construction project showcase'
    }
  ], []);

  // Fetch slideshow images from backend with error handling
  useEffect(() => {
    let mounted = true;
    
    const fetchSlideshowImages = async () => {
      try {
        setLoading(true);
        const response = await Promise.race([
          galleryService.getSlideshowImages(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        
        if (!mounted) return;
        
        if (response.success && response.data && response.data.length > 0) {
          setImages(response.data.slice(0, 5)); // Limit to 5 images max
        } else {
          setImages(defaultImages);
        }
      } catch (err) {
        console.warn('Using fallback images due to:', err.message);
        if (mounted) {
          setImages(defaultImages);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Delay fetch to prioritize above-the-fold content
    const timeoutId = setTimeout(fetchSlideshowImages, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [defaultImages]);

  // Auto-advance slideshow with cleanup
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Slower transition for better performance

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle image load states
  const handleImageLoad = React.useCallback((index) => {
    setImageLoadedStates(prev => ({ ...prev, [index]: true }));
  }, []);

  // Loading state with optimized skeleton
  if (loading) {
    return (
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
        <div className="absolute inset-0 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className="absolute inset-0"
          style={{
            opacity: currentImageIndex === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        >
          <img
            src={image.url}
            alt={image.alt || `Construction showcase ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'} // Eager load first image
            onLoad={() => handleImageLoad(index)}
            onError={(e) => {
              // Fallback to a default image if the URL fails to load
              if (e.target.src !== '/images/gallery/living.jpg') {
                e.target.src = '/images/gallery/living.jpg';
              }
            }}
            style={{
              opacity: imageLoadedStates[index] ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
          
          {/* Simplified Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-center">
              <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
                {image.title || 'Quality Construction'}
              </h3>
              <p className="text-lg text-white/90">
                {image.description || 'Building with precision and care'}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Simplified Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const Home = React.memo(() => {
  // Preload critical images for performance
  useImagePreloading();

  // Memoized static data
  const services = React.useMemo(() => [
    {
      type: 'image',
      image: '/images/gallery/living.jpg',
      title: '3D Design & Visualization',
      description: 'Complete 3D architectural design and visualization of your dream home with detailed floor plans.',
      features: ['3D Modeling', 'Floor Plans', 'Interior Design', 'Exterior Views'],
      link: '/design-construction'
    },
    {
      type: 'image',
      image: '/images/gallery/white.jpg',
      title: 'House Construction',
      description: 'Full turnkey house construction services from foundation to finishing with quality materials.',
      features: ['Foundation Work', 'Structural Work', 'Finishing', 'Quality Control'],
      link: '/design-construction'
    },
    {
      type: 'image',
      image: '/images/gallery/4.jpg',
      title: 'Repair & Maintenance',
      description: 'Professional repair and maintenance services for plumbing, AC, remodeling, and waterproofing.',
      features: ['Plumbing Repair', 'AC Services', 'Remodeling', 'Waterproofing'],
      link: '/repair-maintenance'
    }
  ], []);

  const stats = React.useMemo(() => [
    { number: '200+', label: 'Projects Completed' },
    { number: '150+', label: 'Happy Clients' },
    { number: '10+', label: 'Years Experience' },
    { number: '24/7', label: 'Support Available' }
  ], []);

  const testimonials = React.useMemo(() => [
    {
      name: 'Ram Sharma',
      location: 'Lalitpur',
      rating: 5,
      comment: 'Excellent 3D design service! They helped us visualize our dream home perfectly. The construction quality is outstanding.',
      project: '3D Design & Construction'
    },
    {
      name: 'Sita Devi',
      location: 'Kathmandu',
      rating: 5,
      comment: 'Very professional repair services. They fixed our plumbing issues quickly and efficiently. Highly recommended!',
      project: 'Plumbing Repair'
    },
    {
      name: 'Belu Thapa',
      location: 'Bhaktapur',
      rating: 5,
      comment: 'The cost calculator helped us plan our budget perfectly. The construction timeline was accurate and well-managed.',
      project: 'Full Package Construction'
    }
  ], []);

  // Simplified animation variants
  const fadeInUp = React.useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }), []);

  const staggerContainer = React.useMemo(() => ({
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[80vh] flex items-center pt-36" style={{backgroundColor: '#013b4b'}}>
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
        
        <div className="relative container-custom py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[70vh]">
            <motion.div 
              className="lg:col-span-7 flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block"
              >
              </motion.div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-heading font-bold leading-tight tracking-tight">
                  <span className="block font-display">Transform Your</span>
                  <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent font-display">
                    Dream Into Reality
                  </span>
                  <span className="block text-white/90 font-display">with Diagonal Enterprises</span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 leading-relaxed font-body">
                  From <span className="font-semibold text-yellow-300 font-ui">stunning 3D visualizations</span> to 
                  <span className="font-semibold text-yellow-300 font-ui"> premium construction</span> - we bring your vision to life with 
                  <span className="font-semibold text-orange-300 font-ui">unmatched expertise</span> and attention to detail.
                </p>

                {/* Feature Pills */}
                <motion.div 
                  className="flex flex-wrap gap-2 pt-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {['🏠 3D Design', '🔨 Construction', '🎨 Interior Design', 'Repair & Maintenance'].map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
                    >
                      {feature}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Enhanced CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link 
                  to="/design-construction?tab=booking"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-3 rounded-xl text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>Start Your Dream Project</span>
                  <span className="text-lg">🚀</span>
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>

              {/* Compact Quick Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 hover:bg-gray-700/95 transition-all duration-300 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{ backgroundColor: 'rgba(31, 41, 55, 0.95)' }}
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1" style={{ color: '#FBBF24' }}>
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-200 font-medium" style={{ color: '#E5E7EB' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:col-span-5 flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Enhanced Hero Image with Overlay Content */}
                <div className="w-full h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src="/images/gallery/hero.jpg"
                    alt="Diagonal Enterprises - Professional Construction & 3D Design"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Enhanced Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  {/* Content Overlay with Stats */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="space-y-3"
                    >
                      {/* Mini Achievement Cards (smaller, no rating, no award-winning construction) */}
                      <div className="flex justify-center space-x-2 mt-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-md p-1 text-center border border-white/30 min-w-[70px] max-w-[90px] break-words">
                          <div className="text-sm font-bold text-yellow-300">98%</div>
                          <div className="text-xs text-white/80 whitespace-normal">Satisfaction</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-md p-1 text-center border border-white/30 min-w-[70px] max-w-[90px] break-words">
                          <div className="text-sm font-bold text-orange-300">200+</div>
                          <div className="text-xs text-white/80 whitespace-normal">Projects</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Enhanced Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-float shadow-xl">
                  <FaCheck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '1s' }}>
                  <FaTools className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-1/2 -right-3 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '2s' }}>
                  <FaCube className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Compact Quick Search Widget */}
              <div className="relative z-20">
                <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl relative z-20">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FaSearch className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-base">Quick Search</span>
                      <p className="text-white/70 text-sm">Find what you need instantly</p>
                    </div>
                  </div>
                  <div className="relative z-30">
                    <Suspense fallback={
                      <div className="h-10 bg-white/10 rounded-lg animate-pulse"></div>
                    }>
                      <SearchBar isCompact={true} />
                    </Suspense>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['3D Design', 'Construction', 'Repair', 'Plumbing', 'AC Service', 'Interior'].map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Compact Company Overview & Trust Section */}
      <section className="py-8 text-white relative overflow-hidden z-0" style={{backgroundColor: '#0f4c5c'}}>
        {/* Simplified Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-10 right-10 w-16 h-16 border border-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-12 h-12 border border-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container-custom relative">
          {/* Compact Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-300/30 mb-4">
              <span className="text-lg mr-1">🏛️</span>
              <span className="text-yellow-300 font-bold text-xs">DIAGONAL GROUP • EST. 2010</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 bg-gradient-to-r from-yellow-300 via-orange-300 to-white bg-clip-text text-transparent leading-tight">
              Why Clients Trust Diagonal Group
            </h2>
            
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              <span className="font-bold text-yellow-300">14+ years</span> of pioneering innovation in construction
            </p>
          </motion.div>

          {/* Compact Key Highlights Only */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '🏗️', title: 'Industry Pioneer', desc: 'Since 2010' },
                { icon: '🌱', title: 'Sustainable Focus', desc: 'Eco-friendly practices' },
                { icon: '🎯', title: 'Quality Standards', desc: 'Attention to detail' },
                { icon: '👥', title: 'Expert Team', desc: 'Certified professionals' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 group text-center"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-white/70 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="pt-1 pb-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        
        <div className="container-custom">
          <div className="text-center space-y-2 mb-5">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-primary-700 font-bold mb-4 text-xl">
              🏗️ Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent leading-tight font-display tracking-tight">
              Comprehensive Solutions for
              <span className="block">Every Construction Need</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-body">
              From <span className="font-semibold text-primary-600 font-ui">cutting-edge 3D visualization</span> to 
              <span className="font-semibold text-secondary-600 font-ui"> premium construction services</span> - 
              we deliver excellence at every step of your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative space-y-6 p-8">
                  {/* Enhanced Service Header */}
                  {service.type === 'image' ? (
                    <div className="space-y-4">
                      <div className="w-full h-52 rounded-2xl overflow-hidden relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Service Type Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                            {index === 0 ? '🎨 Design' : index === 1 ? '🏠 Build' : '🔧 Maintain'}
                          </span>
                        </div>
                        
                        {/* Overlay Content */}
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-heading font-semibold group-hover:text-yellow-300 transition-colors duration-300 font-display tracking-wide">
                                {service.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <p className="text-gray-600 leading-relaxed text-lg font-body">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center text-lg">
                      <span className="mr-2">✨</span> What's Included
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Link 
                      to={service.link}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 ${
                        index === 1 
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          : 'bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-primary-600 hover:to-secondary-600 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <span>{index === 1 ? '🚀 Get Started Today' : '📋 Learn More'}</span>
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>

                  {/* Guarantee Badge */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold">
                      💯 <span className="text-green-600">100% Satisfaction Guaranteed</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-3">
                <div className="inline-block px-4 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-bold text-sm">
                  🏆 Why Choose Us
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Excellence Meets Innovation
                  </span>
                  <span className="block text-white mt-1">in Every Project</span>
                </h2>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  We don't just build houses - we craft <span className="font-bold text-yellow-300">dreams into reality</span> using 
                  cutting-edge technology and time-tested craftsmanship.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: '🎨', title: 'Revolutionary 3D Visualization', desc: 'See your dream home before construction begins' },
                  { icon: '💰', title: 'Crystal Clear Cost Breakdown', desc: 'Transparent pricing with no hidden surprises' },
                  { icon: '⚡', title: 'Lightning-Fast Project Delivery', desc: 'Advanced project management ensuring on-time completion' },
                  { icon: '🛡️', title: 'Lifetime Quality Guarantee', desc: '24/7 premium support and maintenance services' }
                ].map((point, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="text-lg mt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        {point.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs mb-0.5 leading-tight">{point.title}</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-2"
              >
                <Link 
                  to="/contact"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold px-5 py-2 rounded-xl text-sm shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <span>Get Your Free Consultation</span>
                  <span className="text-base">🚀</span>
                  <FaArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:col-span-3 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Bigger Image Slideshow Frame */}
              <div className="relative">
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="w-full h-80 lg:h-96">
                    <ImageSlideshow />
                  </div>
                  
                  {/* Minimalistic Achievement Badges */}
                  <div className="absolute -bottom-3 -right-3">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl px-3 py-2 shadow-lg">
                      <div className="text-center text-white">
                        <div className="text-sm font-bold">5.0 ⭐</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-3 -left-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl px-3 py-2 shadow-lg">
                      <div className="text-center text-white">
                        <div className="text-sm font-bold">200+ Projects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="pt-8 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-3 mb-8"
            {...fadeInUp}
          >
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-primary-700 font-bold text-sm mb-3">
              💬 Client Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent leading-tight">
              What Our Happy Clients
              <span className="block">Say About Us</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our <span className="font-bold text-primary-600">200+ satisfied customers</span> 
              who trusted us with their dreams
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group"
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-30"></div>
                
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaQuoteLeft className="text-white w-3 h-3" />
                </div>
                
                <div className="relative p-6 space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-gray-600 font-semibold text-sm">({testimonial.rating}.0)</span>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 italic leading-relaxed text-sm">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{testimonial.name}</h4>
                        <p className="text-gray-600 text-xs flex items-center">
                          <span className="mr-1">📍</span>{testimonial.location}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="inline-block px-2 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-primary-700 text-xs font-semibold">
                        🏆 {testimonial.project}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action in Testimonials */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-lg text-gray-600 mb-6">
              Ready to become our next success story? 🌟
            </p>
            <Link 
              to="/design-construction?tab=booking"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold px-6 py-3 rounded-xl text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Join Our Happy Clients</span>
              <span className="text-lg">🎯</span>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
});

export default Home;
