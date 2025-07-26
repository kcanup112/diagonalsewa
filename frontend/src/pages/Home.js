import React from 'react';
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
  FaArrowRight
} from 'react-icons/fa';

const Home = () => {
  const services = [
    {
      icon: FaCube,
      title: '3D Design & Visualization',
      description: 'Complete 3D architectural design and visualization of your dream home with detailed floor plans.',
      features: ['3D Modeling', 'Floor Plans', 'Interior Design', 'Exterior Views'],
      link: '/design-construction'
    },
    {
      icon: FaTools,
      title: 'House Construction',
      description: 'Full turnkey house construction services from foundation to finishing with quality materials.',
      features: ['Foundation Work', 'Structural Work', 'Finishing', 'Quality Control'],
      link: '/design-construction'
    },
    {
      icon: FaTools,
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
      name: 'John Doe',
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
      <section className="relative bg-gradient-diagonal text-white overflow-hidden">
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
                  with Diagonal
                </h1>
                <p className="text-xl text-gray-100 leading-relaxed">
                  Professional 3D design visualization, turnkey house construction, 
                  and comprehensive repair services in Nepal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/design-construction"
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
                {/* Placeholder for hero image */}
                <div className="w-full h-96 lg:h-[500px] bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FaCube className="w-16 h-16 mx-auto text-accent-400" />
                    <p className="text-lg">3D Design Visualization</p>
                    <p className="text-sm text-gray-300">Interactive house models</p>
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
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                      <service.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-gray-900">
                      {service.title}
                    </h3>
                  </div>

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
                  Why Choose Diagonal Construction?
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
              {/* Placeholder for why choose us image */}
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FaCube className="w-20 h-20 mx-auto text-primary-600" />
                  <p className="text-lg font-medium text-gray-800">Quality Construction</p>
                  <p className="text-gray-600">Building with precision and care</p>
                </div>
              </div>
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
                to="/design-construction"
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
    </div>
  );
};

export default Home;
