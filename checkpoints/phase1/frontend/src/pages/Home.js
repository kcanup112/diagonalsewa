import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCube, 
  FaTools, 
  FaCalculator,
  FaCalendarAlt,
  FaCheck,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';
import SearchBar from '../components/Search/SearchBar';
import Footer from '../components/Layout/Footer';
import { galleryService } from '../services';

// Image Slideshow Component 
const ImageSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch slideshow images from backend
  useEffect(() => {
    const fetchSlideshowImages = async () => {
      try {
        setLoading(true);
        const response = await galleryService.getSlideshowImages();
        
        if (response.success && response.data && response.data.length > 0) {
          setImages(response.data);
          setError(null);
        } else {
          // Fallback to default images if no data received
          setImages([
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
            },
            { 
              id: 4, 
              url: '/images/gallery/4.jpg', 
              title: 'Quality Interiors',
              description: 'Elegant and functional living spaces',
              alt: 'Interior design showcase'
            },
            { 
              id: 5, 
              url: '/images/gallery/repair.jpg', 
              title: 'Expert Repairs',
              description: 'Professional maintenance and repair services',
              alt: 'Repair and maintenance showcase'
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching slideshow images:', err);
        setError(err);
        // Use fallback images on error
        setImages([
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
          },
          { 
            id: 4, 
            url: '/images/gallery/4.jpg', 
            title: 'Quality Interiors',
            description: 'Elegant and functional living spaces',
            alt: 'Interior design showcase'
          },
          { 
            id: 5, 
            url: '/images/gallery/repair.jpg', 
            title: 'Expert Repairs',
            description: 'Professional maintenance and repair services',
            alt: 'Repair and maintenance showcase'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlideshowImages();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading slideshow...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (error || images.length === 0) {
    return (
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src="/images/gallery/living.jpg"
          alt="Construction showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
              Quality Construction
            </h3>
            <p className="text-lg text-white/90">
              Building with precision and care
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
      {images.map((image, index) => (
        <motion.div
          key={image.id || index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentImageIndex === index ? 1 : 0 
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img
            src={image.url}
            alt={image.alt || `Construction showcase ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a default image if the URL fails to load
              e.target.src = '/images/gallery/living.jpg';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
                {image.title || (index === 0 ? 'Quality Construction' : 'Expert Craftsmanship')}
              </h3>
              <p className="text-lg text-white/90">
                {image.description || (index === 0 ? 'Building with precision and care' : 'Professional results you can trust')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      ))}
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const services = [
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
  ];

  const stats = [
    { number: '200+', label: 'Projects Completed' },
    { number: '150+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
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
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{backgroundColor: '#013b4b'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                  Build Your 
                  <span className="block text-accent-400">Dream Home</span>
                  with Diagonal Enterprises
                </h1>
                <p className="text-xl text-gray-100 leading-relaxed">
                  Professional 3D design visualization, turnkey house construction, 
                  and comprehensive repair services in Nepal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/design-construction?tab=booking"
                  className="btn-secondary flex items-center justify-center space-x-2 group"
                >
                  <FaCalendarAlt className="w-5 h-5" />
                  <span>Book Appointment</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link 
                  to="/design-construction"
                  className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 flex items-center justify-center space-x-2"
                >
                  <FaCalculator className="w-5 h-5" />
                  <span>Calculate Cost</span>
                </Link>
              </div>

              {/* Quick Search Widget */}
              <div className="max-w-md">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaSearch className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Quick Search</span>
                  </div>
                  <SearchBar isCompact={true} />
                  <p className="text-white/80 text-sm mt-2">
                    Search for services, calculate costs, or book appointments
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-accent-400">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-200">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Hero Image */}
                <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/gallery/hero.jpg"
                    alt="Diagonal Enterprises - Professional Construction & 3D Design"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-center"
                    >
                      <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
                        Professional Construction & Design
                      </h3>
                      <p className="text-lg text-white/90">
                        Bringing Your Vision to Life
                      </p>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-400 rounded-full flex items-center justify-center animate-float">
                  <FaCheck className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary-400 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <FaTools className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-4 mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete solution from 3D design to house construction and maintenance services
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="card hover:shadow-custom transition-all duration-300 group"
                variants={fadeInUp}
              >
                <div className="space-y-6">
                  {/* Service Header - Icon or Image */}
                  {service.type === 'image' ? (
                    <div className="space-y-4">
                      <div className="w-full h-48 rounded-lg overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                        <service.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                  )}

                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to={service.link}
                    className="inline-flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700 transition-colors duration-200 group"
                  >
                    <span>Learn More</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                  Why Choose Diagonal Enterprises?
                </h2>
                <p className="text-xl text-gray-600">
                  We combine traditional craftsmanship with modern technology to deliver exceptional results.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  'Professional 3D visualization before construction',
                  'Transparent cost estimation with detailed breakdown',
                  'Quality materials and skilled craftsmen',
                  'Timeline management with project tracking',
                  '24/7 customer support and maintenance',
                  'Competitive pricing with no hidden costs'
                ].map((point, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </motion.div>
                ))}
              </div>

              <Link 
                to="/contact"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Contact Us Today</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Image Slideshow */}
              <ImageSlideshow />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-4 mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="card relative"
                variants={fadeInUp}
              >
                <FaQuoteLeft className="absolute top-4 right-6 text-primary-200 w-8 h-8" />
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary-600 font-medium">{testimonial.project}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-diagonal text-white">
        <div className="container-custom text-center">
          <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Ready to Start Your Construction Project?
            </h2>
            <p className="text-xl text-gray-100">
              Get a free consultation and detailed cost estimate for your dream home today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/design-construction?tab=booking"
                className="btn-secondary"
              >
                Book Free Consultation
              </Link>
              <Link 
                to="/design-construction"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
              >
                Calculate Construction Cost
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
