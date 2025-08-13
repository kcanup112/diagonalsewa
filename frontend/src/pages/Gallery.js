import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Cleaned up gallery page - removed unnecessary icon imports for cleaner design
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
    <div className="min-h-screen">
      {/* Hidden SEO and Search Keywords for Gallery */}
      <div className="sr-only" aria-hidden="true">
        {/* Gallery Keywords */}
        project gallery portfolio construction photos before after photos
        completed projects work showcase project examples construction work
        residential projects commercial projects building photos house photos
        
        {/* Project Types Keywords */}
        3D design projects visualization projects architectural projects
        construction projects remodeling projects renovation projects
        interior design projects exterior design projects landscape projects
        luxury homes modern homes traditional homes custom homes
        
        {/* Photography Keywords */}
        construction photography architectural photography interior photography
        project documentation progress photos completion photos
        professional photography high quality photos project showcase
        
        {/* Project Categories Keywords */}
        residential construction commercial construction industrial construction
        home construction house building apartment construction villa construction
        office construction retail construction warehouse construction
        
        {/* Design Categories Keywords */}
        modern design contemporary design traditional design luxury design
        minimalist design classic design architectural design interior design
        landscape design sustainable design eco-friendly construction
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative text-white pt-36 pb-16 overflow-hidden" style={{backgroundColor: '#013b4b'}}>
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
        
        <div className="relative container-custom">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-gray-900 font-bold mb-4">
              🖼️ Our Portfolio
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="w-8 h-8 text-white flex items-center justify-center">🖼️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Project Gallery
              </span>
              <span className="block text-white mt-2">Excellence in Every Detail</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of <span className="font-bold text-yellow-300">completed projects</span>, showcasing our 
              <span className="font-bold text-orange-300">expertise in construction</span>, design, and maintenance services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Slider */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-primary-700 font-bold text-sm mb-4">
              ⭐ Featured Work
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent leading-tight">
              Featured Projects
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse through our <span className="font-bold text-primary-600">stunning collection</span> of completed projects showcasing our 
              <span className="font-bold text-secondary-600">expertise in 3D design</span> and construction.
            </p>
          </motion.div>

          {/* Photo Slider Component */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <span className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4 flex items-center justify-center">⏳</span>
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
                <span className="w-5 h-5 flex items-center justify-center">🖼️</span>
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
                <span className="w-5 h-5 flex items-center justify-center">🎥</span>
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
                    <span className="w-12 h-12 mb-2 flex items-center justify-center text-3xl">➕</span>
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
                            <span className="w-4 h-4 flex items-center justify-center">👁️</span>
                          </button>
                          <button className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50">
                            <span className="w-4 h-4 flex items-center justify-center">🗑️</span>
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
                    <span className="w-12 h-12 mb-2 flex items-center justify-center text-3xl">➕</span>
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
                          <span className="w-8 h-8 text-white flex items-center justify-center text-2xl">▶️</span>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button className="bg-white text-primary-500 p-2 rounded-full hover:bg-primary-50">
                          <span className="w-4 h-4 flex items-center justify-center">👁️</span>
                        </button>
                        <button className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50">
                          <span className="w-4 h-4 flex items-center justify-center">🗑️</span>
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
              <span className="w-8 h-8 text-accent-600 mx-auto mb-3 flex items-center justify-center">📤</span>
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
