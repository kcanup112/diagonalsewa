import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaImages, FaVideo, FaUpload, FaEye, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import PhotoSlider from '../components/PhotoSlider';
import { galleryService } from '../services';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery data on component mount
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        
        // Fetch photos and categories in parallel
        const [photosResponse, categoriesResponse] = await Promise.all([
          galleryService.getGalleryPhotos(),
          galleryService.getGalleryCategories()
        ]);

        if (photosResponse.success && photosResponse.data) {
          setPhotos(photosResponse.data);
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(['All', ...categoriesResponse.data]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Sample videos data (you can extend this to fetch from backend too)
  const videos = [
    { id: 1, url: '/images/gallery/hero.jpg', title: '3D House Walkthrough', duration: '2:30' },
    { id: 2, url: '/images/gallery/4.jpg', title: 'Construction Progress', duration: '1:45' },
    { id: 3, url: '/images/gallery/living.jpg', title: 'Before & After', duration: '3:15' },
  ];

  const filteredPhotos = selectedCategory === 'All' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  // Get featured photos for slider
  const featuredPhotos = photos.filter(photo => photo.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white py-20" style={{backgroundColor: '#013b4b'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Project Gallery
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Explore our portfolio of completed projects, showcasing our expertise in 
              construction, design, and maintenance services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Slider */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our stunning collection of completed projects showcasing our expertise in 3D design and construction.
            </p>
          </motion.div>

          {/* Photo Slider Component */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <FaSpinner className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading featured projects...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <PhotoSlider 
                title="Project Gallery - Our Best Work"
                images={featuredPhotos.map(photo => ({
                  src: photo.url,
                  alt: photo.alt,
                  caption: photo.description
                }))}
              />
            )}
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                  activeTab === 'photos'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                <FaImages className="w-5 h-5" />
                <span>Photos</span>
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                  activeTab === 'videos'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                <FaVideo className="w-5 h-5" />
                <span>Videos</span>
              </button>
            </div>
          </div>

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-secondary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-secondary-100 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upload New Photo Card */}
                <motion.div
                  className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 transition-colors duration-300">
                    <FaPlus className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Upload New Photo</span>
                  </div>
                </motion.div>

                {filteredPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                          <button className="bg-white text-primary-500 p-2 rounded-full hover:bg-primary-50">
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <span className="absolute top-2 right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded">
                        {photo.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{photo.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upload New Video Card */}
                <motion.div
                  className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 transition-colors duration-300">
                    <FaPlus className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Upload New Video</span>
                  </div>
                </motion.div>

                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={video.url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="bg-white bg-opacity-20 rounded-full p-4">
                          <FaVideo className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button className="bg-white text-primary-500 p-2 rounded-full hover:bg-primary-50">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{video.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon Message */}
          <div className="text-center mt-12">
            <div className="bg-accent-100 border border-accent-300 rounded-lg p-6 max-w-md mx-auto">
              <FaUpload className="w-8 h-8 text-accent-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-accent-800 mb-2">Upload Functionality Coming Soon</h3>
              <p className="text-accent-700 text-sm">
                We're working on implementing the upload feature for photos and videos. 
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
