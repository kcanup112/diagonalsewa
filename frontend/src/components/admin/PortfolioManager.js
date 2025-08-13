import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/api';

const PortfolioManager = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    location: '',
    projectType: '3D Design',
    completionDate: '',
    images: [],
    videos: [],
    youtubeUrls: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Project type options
  const projectTypes = [
    '3D Design',
    'Construction', 
    '3D Design + Construction',
    'Renovation',
    'Interior Design'
  ];

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getAll();
      // The API interceptor already returns response.data, so response is the array directly
      setPortfolios(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]); // Allow multiple file additions
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddYoutubeUrl = () => {
    if (youtubeUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        youtubeUrls: [...prev.youtubeUrls, youtubeUrl.trim()]
      }));
      setYoutubeUrl('');
    }
  };

  const removeYoutubeUrl = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      youtubeUrls: prev.youtubeUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'videos' && key !== 'youtubeUrls') {
        data.append(key, formData[key]);
      }
    });

    // Append YouTube URLs as JSON
    if (formData.youtubeUrls.length > 0) {
      data.append('youtubeUrls', JSON.stringify(formData.youtubeUrls));
    }

    // Append files
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        data.append('images', file);
      } else if (file.type.startsWith('video/')) {
        data.append('videos', file);
      }
    });

    try {
      setLoading(true);
      if (editingPortfolio) {
        await portfolioService.update(editingPortfolio.id, data);
      } else {
        await portfolioService.create(data);
      }
      
      await fetchPortfolios();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Error saving portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title || '',
      description: portfolio.description || '',
      area: portfolio.area || '',
      location: portfolio.location || '',
      projectType: portfolio.projectType || '3D Design',
      completionDate: portfolio.completionDate ? portfolio.completionDate.split('T')[0] : '',
      images: portfolio.images || [],
      videos: portfolio.videos || [],
      youtubeUrls: portfolio.youtubeUrls || []
    });
    setSelectedFiles([]);
    setYoutubeUrl('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }

    try {
      setLoading(true);
      await portfolioService.delete(id);
      await fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Error deleting portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      area: '',
      location: '',
      projectType: '3D Design',
      completionDate: '',
      images: [],
      videos: [],
      youtubeUrls: []
    });
    setSelectedFiles([]);
    setYoutubeUrl('');
    setEditingPortfolio(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="portfolio-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Management</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          Add New Portfolio
        </button>
      </div>

      {loading && !showModal && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading portfolios...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {portfolio.images && portfolio.images.length > 0 && (
              <img
                src={`/uploads/portfolios/${portfolio.images[0]}`}
                alt={portfolio.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{portfolio.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{portfolio.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><span className="font-medium">Area:</span> {portfolio.area}</p>
                <p><span className="font-medium">Location:</span> {portfolio.location}</p>
                <p><span className="font-medium">Type:</span> {portfolio.projectType}</p>
                {portfolio.completionDate && (
                  <p><span className="font-medium">Completed:</span> {new Date(portfolio.completionDate).toLocaleDateString()}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(portfolio)}
                  className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(portfolio.id)}
                  className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolios.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No portfolios found. Create your first portfolio to get started!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 2500 sq ft"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Kathmandu, Nepal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images & Videos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select multiple images and videos. Max 50MB per file, up to 20 files.
                  </p>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                      <div className="space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                            <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                              disabled={loading}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube Videos
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={handleAddYoutubeUrl}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      disabled={loading || !youtubeUrl.trim()}
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add YouTube video URLs to showcase your work.
                  </p>
                  {formData.youtubeUrls.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">YouTube Videos:</p>
                      <div className="space-y-1">
                        {formData.youtubeUrls.map((url, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                            <span className="truncate">{url}</span>
                            <button
                              type="button"
                              onClick={() => removeYoutubeUrl(index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                              disabled={loading}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingPortfolio ? 'Update Portfolio' : 'Create Portfolio')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
