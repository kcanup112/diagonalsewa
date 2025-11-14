import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoSlider = ({ images, title = "3D Design Gallery" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check for empty or invalid images
  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white p-4">
          <h3 className="text-xl font-bold text-center">{title}</h3>
        </div>
        <div className="flex items-center justify-center h-96 md:h-[500px] bg-gray-100">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">No images available</p>
            <p className="text-sm">Please add some featured photos to display in the slideshow</p>
          </div>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white p-4">
        <h3 className="text-xl font-bold text-center">{title}</h3>
      </div>

      {/* Main Slider Container */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                console.warn(`Failed to load image: ${images[currentIndex].src}`);
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
                e.target.innerHTML = '<div class="text-gray-500 text-center"><p>Image not available</p></div>';
              }}
            />
            
            {/* Image Overlay with Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-lg font-medium text-center"
              >
                {images[currentIndex].caption}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="p-4 bg-gray-50">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === index 
                  ? 'border-teal-600 shadow-lg scale-105' 
                  : 'border-gray-300 hover:border-teal-400'
              }`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.display = 'flex';
                  e.target.style.alignItems = 'center';
                  e.target.style.justifyContent = 'center';
                  e.target.innerHTML = '<div class="text-xs text-gray-500">?</div>';
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="p-4 bg-gray-100">
        <div className="w-full bg-gray-300 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-teal-600 to-teal-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Progress</span>
          <span>{Math.round(((currentIndex + 1) / images.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoSlider;
