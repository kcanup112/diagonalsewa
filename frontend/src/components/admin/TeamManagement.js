import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaEye,
  FaSave,
  FaTimes,
  FaUpload,
  FaCheck,
  FaCertificate
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { teamService } from '../../services/api';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    position: '',
    experience: '',
    overview: '',
    qualifications: [],
    certifications: [],
    workDescription: '',
    email: '',
    profileImage: '',
    isActive: true,
    displayOrder: 0
  });
  const [newQualification, setNewQualification] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await teamService.getAllForAdmin();
      
      // The API interceptor returns response.data directly, so response is the actual data
      if (response.success) {
        setTeamMembers(response.data || []);
      } else {
        toast.error('Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Error loading team members');
      setTeamMembers([]); // Set empty array as fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (currentMember.overview.length < 5) {
      toast.error('Overview must be at least 5 characters long');
      return;
    }
    
    if (currentMember.workDescription.length < 5) {
      toast.error('Work description must be at least 5 characters long');
      return;
    }
    
    if (currentMember.overview.length > 1000) {
      toast.error('Overview cannot exceed 1000 characters');
      return;
    }
    
    if (currentMember.workDescription.length > 500) {
      toast.error('Work description cannot exceed 500 characters');
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(currentMember).forEach(key => {
        if (key === 'qualifications' || key === 'certifications') {
          formData.append(key, JSON.stringify(currentMember[key]));
        } else {
          formData.append(key, currentMember[key]);
        }
      });
      
      // Add image file if exists
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = isEditing 
        ? await teamService.update(currentMember.id, formData)
        : await teamService.create(formData);
      
      if (response.success) {
        toast.success(isEditing ? 'Team member updated!' : 'Team member added!');
        setShowModal(false);
        resetForm();
        fetchTeamMembers();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(error.message || 'Error saving team member');
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentMember({
      name: '',
      position: '',
      experience: '',
      overview: '',
      qualifications: [],
      certifications: [],
      workDescription: '',
      email: '',
      profileImage: '',
      isActive: true,
      displayOrder: 0
    });
    setNewQualification('');
    setNewCertification('');
    setImageFile(null);
    setImagePreview('');
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (member) => {
    setCurrentMember(member);
    setImagePreview(member.profileImage || '');
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await teamService.delete(id);
      
      if (response.success) {
        toast.success('Team member deleted!');
        fetchTeamMembers();
      } else {
        toast.error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Error deleting team member');
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !currentStatus);
      
      const response = await teamService.update(id, formData);
      
      if (response.success) {
        toast.success('Status updated!');
        fetchTeamMembers();
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add qualification
  const addQualification = () => {
    if (newQualification.trim()) {
      setCurrentMember(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  // Remove qualification
  const removeQualification = (index) => {
    setCurrentMember(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  // Add certification
  const addCertification = () => {
    if (newCertification.trim()) {
      setCurrentMember(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  // Remove certification
  const removeCertification = (index) => {
    setCurrentMember(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Loading team members...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaUsers className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
            <p className="text-gray-600">Manage your team members and their profiles</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            className="card hover:shadow-lg transition-shadow duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              {/* Profile Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUsers className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Member Info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-primary-600 font-medium mb-2">
                {member.position}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {member.experience} experience
              </p>
              
              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  member.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(member.id, member.isActive)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    member.isActive 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={member.isActive ? 'Deactivate' : 'Activate'}
                >
                  <FaCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first team member.</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary"
          >
            Add Team Member
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

            <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
                  </h3>
                </div>

                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Profile Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUsers className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <span className="btn-outline flex items-center space-x-2">
                            <FaUpload className="w-4 h-4" />
                            <span>Upload Image</span>
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={currentMember.name}
                          onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position *
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={currentMember.position}
                          onChange={(e) => setCurrentMember(prev => ({ ...prev, position: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., 5+ years"
                          className="input-field"
                          value={currentMember.experience}
                          onChange={(e) => setCurrentMember(prev => ({ ...prev, experience: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          className="input-field"
                          value={currentMember.email}
                          onChange={(e) => setCurrentMember(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Overview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overview * (min 5 characters)
                      </label>
                      <textarea
                        required
                        rows={3}
                        minLength={5}
                        maxLength={1000}
                        className="input-field"
                        placeholder="Brief overview of the team member (minimum 5 characters)..."
                        value={currentMember.overview}
                        onChange={(e) => setCurrentMember(prev => ({ ...prev, overview: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {currentMember.overview.length}/1000 characters (minimum 5 required)
                      </p>
                    </div>

                    {/* Work Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Description * (min 5 characters)
                      </label>
                      <textarea
                        required
                        rows={3}
                        minLength={5}
                        maxLength={500}
                        className="input-field"
                        placeholder="Detailed work description (minimum 5 characters)..."
                        value={currentMember.workDescription}
                        onChange={(e) => setCurrentMember(prev => ({ ...prev, workDescription: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {currentMember.workDescription.length}/500 characters (minimum 5 required)
                      </p>
                    </div>

                    {/* Qualifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualifications
                      </label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            className="input-field flex-1"
                            placeholder="Add qualification..."
                            value={newQualification}
                            onChange={(e) => setNewQualification(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addQualification();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addQualification}
                            className="btn-outline px-3"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {currentMember.qualifications.map((qual, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-700">{qual}</span>
                              <button
                                type="button"
                                onClick={() => removeQualification(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        <FaCertificate className="inline w-4 h-4 mr-2 text-accent-500" />
                        Certifications
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            placeholder="Add certification"
                            className="form-input flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCertification();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addCertification}
                            className="btn-outline px-3"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {currentMember.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between bg-accent-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-700">{cert}</span>
                              <button
                                type="button"
                                onClick={() => removeCertification(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="input-field"
                          value={currentMember.displayOrder}
                          onChange={(e) => setCurrentMember(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={currentMember.isActive}
                            onChange={(e) => setCurrentMember(prev => ({ ...prev, isActive: e.target.checked }))}
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    <FaTimes className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <FaSave className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update' : 'Save'}
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

export default TeamManagement;
