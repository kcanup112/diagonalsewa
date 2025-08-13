import React from 'react';
import { motion } from 'framer-motion';
import PortfolioDisplay from '../components/Portfolio/PortfolioDisplay';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-white/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container-custom text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-gray-900 font-bold mb-6">
              🏆 Our Success Stories
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              <span className="block">Portfolio of</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Completed Projects
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Explore our <span className="font-bold text-yellow-300">200+ successful projects</span> - 
              from stunning <span className="font-bold text-orange-300">3D visualizations</span> to 
              <span className="font-bold text-red-300"> completed constructions</span>
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { number: '200+', label: 'Projects Completed' },
                { number: '150+', label: 'Happy Clients' },
                { number: '98%', label: 'Satisfaction Rate' },
                { number: '5★', label: 'Average Rating' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/90 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Content */}
      <section className="py-16">
        <div className="container-custom">
          <PortfolioDisplay />
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
