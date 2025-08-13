import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaRulerCombined, 
  FaCalendar, 
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

const PortfolioDisplay = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch portfolios from backend
  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios');
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open portfolio popup
  const openPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Close portfolio popup
  const closePortfolio = () => {
    setSelectedPortfolio(null);
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedPortfolio) return;

      switch (e.key) {
        case 'Escape':
          closePortfolio();
          break;
        case 'ArrowLeft':
          navigateMedia('prev');
          break;
        case 'ArrowRight':
          navigateMedia('next');
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          toggleVideoPlay();
          break;
        default:
          break;
      }
    };

    if (selectedPortfolio) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedPortfolio, currentMediaIndex]);

  // Navigate media
  const navigateMedia = (direction) => {
    if (!selectedPortfolio) return;
    
    const allMedia = [
      ...(selectedPortfolio.images || []).map(img => ({ type: 'image', src: img })),
      ...(selectedPortfolio.videos || []).map(vid => ({ type: 'video', src: vid })),
      ...(selectedPortfolio.youtubeUrls || []).map(url => ({ type: 'youtube', src: url }))
    ];

    if (direction === 'next') {
      setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
    } else {
      setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    }
    setIsVideoPlaying(false);
  };

  // Toggle video play/pause
  const toggleVideoPlay = () => {
    const video = document.getElementById('portfolio-video');
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get current media
  const getCurrentMedia = () => {
    if (!selectedPortfolio) return null;
    
    const allMedia = [
      ...(selectedPortfolio.images || []).map(img => ({ type: 'image', src: img })),
      ...(selectedPortfolio.videos || []).map(vid => ({ type: 'video', src: vid })),
      ...(selectedPortfolio.youtubeUrls || []).map(url => ({ type: 'youtube', src: url }))
    ];

    return allMedia[currentMediaIndex] || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Portfolio Items Yet
        </h3>
        <p className="text-gray-600">
          We're working on adding our completed projects. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Portfolio Header */}
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-heading font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Completed Projects
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Explore our portfolio of successful 3D designs and construction projects. 
          Click on any project to see detailed images, videos, and project information.
        </motion.p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolios.map((portfolio, index) => (
          <motion.div
            key={portfolio._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => openPortfolio(portfolio)}
          >
            {/* Project Image */}
            <div className="h-64 bg-gray-200 relative overflow-hidden">
              {portfolio.images && portfolio.images.length > 0 ? (
                <img
                  src={`/uploads/portfolios/${portfolio.images[0]}`}
                  alt={portfolio.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-gray-400 text-4xl">🏠</span>
                </div>
              )}
              
              {/* Media Count Overlay */}
              <div className="absolute top-3 right-3 flex space-x-2">
                {portfolio.images && portfolio.images.length > 0 && (
                  <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <span>📷</span>
                    <span>{portfolio.images.length}</span>
                  </span>
                )}
                {portfolio.videos && portfolio.videos.length > 0 && (
                  <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <span>🎥</span>
                    <span>{portfolio.videos.length}</span>
                  </span>
                )}
                {portfolio.youtubeUrls && portfolio.youtubeUrls.length > 0 && (
                  <span className="bg-red-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <span>🎬</span>
                    <span>{portfolio.youtubeUrls.length}</span>
                  </span>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Project
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {portfolio.title}
                  </h3>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                    {portfolio.projectType}
                  </span>
                </div>

                <p className="text-gray-600 line-clamp-2">
                  {portfolio.description}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-primary-500" />
                    <span>{portfolio.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaRulerCombined className="w-4 h-4 mr-2 text-secondary-500" />
                    <span>{portfolio.area}</span>
                  </div>
                  {portfolio.completionDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendar className="w-4 h-4 mr-2 text-accent-500" />
                      <span>{new Date(portfolio.completionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePortfolio}
          >
            <motion.div
              className={`bg-white rounded-lg overflow-hidden shadow-2xl ${
                isFullscreen ? 'w-full h-full' : 'max-w-6xl max-h-[90vh] w-full'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPortfolio.title}</h3>
                  <p className="text-sm text-gray-600">{selectedPortfolio.projectType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  >
                    {isFullscreen ? <FaCompress className="w-5 h-5" /> : <FaExpand className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={closePortfolio}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Close (ESC)"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`flex ${isFullscreen ? 'h-full' : 'max-h-[70vh]'}`}>
                {/* Media Viewer */}
                <div className="flex-1 bg-black relative flex items-center justify-center">
                  {(() => {
                    const currentMedia = getCurrentMedia();
                    if (!currentMedia) return null;

                    if (currentMedia.type === 'image') {
                      return (
                        <img
                          src={`/uploads/portfolios/${currentMedia.src}`}
                          alt={selectedPortfolio.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      );
                    } else if (currentMedia.type === 'youtube') {
                      // Extract YouTube video ID from URL
                      const getYouTubeVideoId = (url) => {
                        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
                        return match ? match[1] : null;
                      };
                      
                      const videoId = getYouTubeVideoId(currentMedia.src);
                      
                      return videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                          className="w-full h-96 md:h-[500px]"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={selectedPortfolio.title}
                        />
                      ) : (
                        <div className="text-white text-center p-8">
                          <p>Invalid YouTube URL</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="relative">
                          <video
                            id="portfolio-video"
                            src={`/uploads/portfolios/${currentMedia.src}`}
                            className="max-w-full max-h-full"
                            controls
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                          />
                          {!isVideoPlaying && (
                            <button
                              onClick={toggleVideoPlay}
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                            >
                              <FaPlay className="w-16 h-16 text-white" />
                            </button>
                          )}
                        </div>
                      );
                    }
                  })()}

                  {/* Navigation Arrows */}
                  {(() => {
                    const totalMedia = (selectedPortfolio.images?.length || 0) + (selectedPortfolio.videos?.length || 0);
                    if (totalMedia > 1) {
                      return (
                        <>
                          <button
                            onClick={() => navigateMedia('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                            title="Previous (←)"
                          >
                            <FaChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => navigateMedia('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                            title="Next (→)"
                          >
                            <FaChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      );
                    }
                    return null;
                  })()}

                  {/* Media Counter */}
                  {(() => {
                    const totalMedia = (selectedPortfolio.images?.length || 0) + (selectedPortfolio.videos?.length || 0);
                    if (totalMedia > 1) {
                      return (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                          {currentMediaIndex + 1} / {totalMedia}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Project Details Sidebar */}
                {!isFullscreen && (
                  <div className="w-80 bg-white p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Project Details</h4>
                        <p className="text-gray-600">{selectedPortfolio.description}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FaMapMarkerAlt className="w-5 h-5 text-primary-500" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium">{selectedPortfolio.location}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FaRulerCombined className="w-5 h-5 text-secondary-500" />
                          <div>
                            <div className="text-sm text-gray-500">Area</div>
                            <div className="font-medium">{selectedPortfolio.area}</div>
                          </div>
                        </div>

                        {selectedPortfolio.completionDate && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <FaCalendar className="w-5 h-5 text-accent-500" />
                            <div>
                              <div className="text-sm text-gray-500">Completed</div>
                              <div className="font-medium">
                                {new Date(selectedPortfolio.completionDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Keyboard Shortcuts */}
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Keyboard Shortcuts</h5>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>• ESC - Close</div>
                          <div>• ← → - Navigate media</div>
                          <div>• F - Toggle fullscreen</div>
                          <div>• Space - Play/pause video</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioDisplay;
