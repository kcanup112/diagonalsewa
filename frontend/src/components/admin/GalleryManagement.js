import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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
  FaArrowDown
} from 'react-icons/fa';
import { galleryService } from '../../services';

const GalleryManagement = () => {
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchSlideshowImages();
  }, []);

  const fetchSlideshowImages = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getSlideshowImages();
      if (response.success && response.data) {
        setSlideshowImages(response.data);
      }
    } catch (error) {
      console.error('Error fetching slideshow images:', error);
      toast.error('Failed to load slideshow images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await galleryService.deleteImage(imageId);
      
      if (response.success) {
        toast.success('Image deleted successfully!');
        setSlideshowImages(prev => prev.filter(img => img.id !== imageId));
        setDeleteConfirm(null);
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete image');
    }
  };

  const handleUpdateImage = async (imageId, updatedData) => {
    try {
      const response = await galleryService.updateImage(imageId, updatedData);
      
      if (response.success) {
        toast.success('Image updated successfully!');
        fetchSlideshowImages();
        setEditingImage(null);
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update image');
    }
  };

  const handleReorderImages = async (fromIndex, toIndex) => {
    const newImages = [...slideshowImages];
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);

    setSlideshowImages(newImages);

    try {
      // Update positions in backend
      const updatePromises = newImages.map((img, index) =>
        galleryService.updateImagePosition(img.id, index)
      );
      await Promise.all(updatePromises);
      toast.success('Image order updated successfully!');
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to update image order');
      fetchSlideshowImages(); // Revert on error
    }
  };

  const ImageUploadModal = React.memo(() => {
    const [localUploadForm, setLocalUploadForm] = useState({
      image: null,
      title: '',
      description: '',
      alt: '',
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
        formData.append('position', localUploadForm.position);
        formData.append('type', 'slideshow');

        const response = await galleryService.uploadImage(formData);
        
        if (response.success) {
          toast.success('Image uploaded successfully!');
          setShowUploadModal(false);
          setLocalUploadForm({ image: null, title: '', description: '', alt: '', position: 0 });
          fetchSlideshowImages();
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
            toast.error(errorData.message || 'Failed to upload image');
          }
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Failed to upload image. Please try again.');
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
            <h3 className="text-lg font-semibold text-gray-900">Upload New Image</h3>
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
                      e.target.value = ''; // Clear the input
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
                placeholder="Enter image title"
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
                placeholder="Enter image description"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600">Manage slideshow images for the homepage</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Slideshow Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slideshowImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Image */}
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReorderImages(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-primary-600 disabled:opacity-30"
                  >
                    <FaArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorderImages(index, Math.min(slideshowImages.length - 1, index + 1))}
                    disabled={index === slideshowImages.length - 1}
                    className="text-gray-400 hover:text-primary-600 disabled:opacity-30"
                  >
                    <FaArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(image.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {slideshowImages.length === 0 && (
        <div className="text-center py-12">
          <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No slideshow images</h3>
          <p className="text-gray-600 mb-4">Upload your first slideshow image to get started.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add First Image
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && <ImageUploadModal />}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Image</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteImage(deleteConfirm)}
                className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryManagement;
