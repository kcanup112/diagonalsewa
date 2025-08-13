import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaImage, 
  FaUpload, 
  FaTrash, 
  FaEdit,
  FaEye,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaSave,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import { galleryService } from '../../services';

const GalleryPhotoManagement = () => {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const [photosResponse, categoriesResponse] = await Promise.all([
        galleryService.getGalleryPhotos(),
        galleryService.getGalleryCategories()
      ]);

      if (photosResponse.success && photosResponse.data) {
        setGalleryPhotos(photosResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      toast.error('Failed to load gallery data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const response = await galleryService.deleteGalleryPhoto(photoId);
      
      if (response.success) {
        toast.success('Photo deleted successfully!');
        setGalleryPhotos(prev => prev.filter(photo => photo.id !== photoId));
        setDeleteConfirm(null);
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete photo');
    }
  };

  const handleUpdatePhoto = async (photoId, updatedData) => {
    try {
      const response = await galleryService.updateGalleryPhoto(photoId, updatedData);
      
      if (response.success) {
        toast.success('Photo updated successfully!');
        fetchGalleryData();
        setEditingPhoto(null);
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update photo');
    }
  };

  const toggleFeatured = async (photo) => {
    await handleUpdatePhoto(photo.id, { 
      ...photo, 
      featured: !photo.featured 
    });
  };

  const PhotoUploadModal = React.memo(() => {
    const [localUploadForm, setLocalUploadForm] = useState({
      image: null,
      title: '',
      description: '',
      alt: '',
      category: categories[0] || 'Interior',
      featured: false,
      position: 0
    });

    const handleLocalSubmit = async (e) => {
      e.preventDefault();
      if (!localUploadForm.image) {
        toast.error('Please select an image');
        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', localUploadForm.image);
        formData.append('title', localUploadForm.title);
        formData.append('description', localUploadForm.description);
        formData.append('alt', localUploadForm.alt);
        formData.append('category', localUploadForm.category);
        formData.append('featured', localUploadForm.featured.toString());
        formData.append('position', localUploadForm.position);
        formData.append('type', 'gallery');

        const response = await galleryService.uploadGalleryPhoto(formData);
        
        if (response.success) {
          toast.success('Photo uploaded successfully!');
          setShowUploadModal(false);
          setLocalUploadForm({
            image: null,
            title: '',
            description: '',
            alt: '',
            category: categories[0] || 'Interior',
            featured: false,
            position: 0
          });
          fetchGalleryData();
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        
        // Handle specific error types
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.error === 'FILE_TOO_LARGE') {
            toast.error('Image file is too large. Please choose a file smaller than 10MB.');
          } else if (errorData.error === 'INVALID_FIELD_NAME') {
            toast.error('Invalid file upload. Please try again.');
          } else {
            toast.error(errorData.message || 'Failed to upload photo');
          }
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Failed to upload photo. Please try again.');
        }
      } finally {
        setUploading(false);
      }
    };

    return (
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upload New Gallery Photo</h3>
            <button 
              onClick={() => setShowUploadModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLocalSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image File * <span className="text-sm text-gray-500">(Max: 10MB)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Check file size (10MB = 10 * 1024 * 1024 bytes)
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error('File size must be less than 10MB. Please choose a smaller image.');
                      e.target.value = '';
                      return;
                    }
                    setLocalUploadForm(prev => ({ ...prev, image: file }));
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, WebP (Max size: 10MB)
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={localUploadForm.title}
                onChange={(e) => setLocalUploadForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter photo title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={localUploadForm.description}
                onChange={(e) => setLocalUploadForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Enter photo description"
                required
              />
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text *
              </label>
              <input
                type="text"
                value={localUploadForm.alt}
                onChange={(e) => setLocalUploadForm(prev => ({ ...prev, alt: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter alt text for accessibility"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={localUploadForm.category}
                onChange={(e) => setLocalUploadForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Featured */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localUploadForm.featured}
                  onChange={(e) => setLocalUploadForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Featured Photo</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Featured photos appear in the slideshow
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FaUpload className="w-4 h-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  });

  const filteredPhotos = selectedCategory === 'All' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gallery Photo Management</h2>
          <p className="text-gray-600">Manage photos for the gallery page</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({galleryPhotos.length})
        </button>
        {categories.map(category => {
          const count = galleryPhotos.filter(photo => photo.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Gallery Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Photo */}
            <div className="aspect-w-16 aspect-h-12 relative">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/images/gallery/placeholder.jpg';
                }}
              />
              
              {/* Featured Badge */}
              {photo.featured && (
                <div className="absolute top-3 left-3">
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <FaStar className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  {photo.category}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {photo.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {photo.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFeatured(photo)}
                    className={`p-2 rounded-lg transition-colors ${
                      photo.featured
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={photo.featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    {photo.featured ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Edit photo"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(photo)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete photo"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <FaEye className="w-3 h-3" />
                  <span>Position: {photo.position}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'All' 
              ? 'No gallery photos have been added yet.' 
              : `No photos found in the "${selectedCategory}" category.`}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            Add First Photo
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && <PhotoUploadModal />}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Photo</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePhoto(deleteConfirm.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryPhotoManagement;
