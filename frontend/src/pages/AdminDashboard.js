import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FaUsers, 
  FaCalendarCheck, 
  FaRupeeSign,
  FaTools,
  FaChartLine,
  FaEnvelope,
  FaSignOutAlt,
  FaEye,
  FaTrash,
  FaDownload,
  FaPlus,
  FaImage,
  FaDownloadAlt
  // FaGift // Removed since offers are disabled
} from 'react-icons/fa';

import { adminService } from '../services';
import { useApp } from '../context/AppContext';
import TeamManagement from '../components/admin/TeamManagement';
import GalleryManagement from '../components/admin/GalleryManagement';
import GalleryPhotoManagement from '../components/admin/GalleryPhotoManagement';
import PortfolioManager from '../components/admin/PortfolioManager';
// import OfferManagement from '../components/admin/OfferManagement'; // Disabled temporarily

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, setLoading } = useApp();
  
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      totalAppointments: 0,
      pendingAppointments: 0,
      completedAppointments: 0,
      monthlyAppointments: 0,
      weeklyAppointments: 0
    },
    recentAppointments: [],
    serviceDistribution: [],
    monthlyTrends: [],
    recent_repairs: [], // Fallback for compatibility
    recent_contacts: [] // Fallback for compatibility
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [viewDetailsLoading, setViewDetailsLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboard();
      
      console.log('Dashboard response:', response);
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
      
      // If unauthorized, redirect to login
      if (error.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatServiceType = (serviceType) => {
    const serviceMap = {
      '3d_design': '3D Design & Visualization',
      'full_package': 'Full House Construction Package',
      'consultation': 'Construction Consultation',
      'repair_maintenance': 'Repair & Maintenance'
    };
    return serviceMap[serviceType] || serviceType;
  };

  // Download functions
  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'repair-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const downloadAllImages = async (images, customerName, bookingId) => {
    if (!images || images.length === 0) {
      toast.error('No images to download');
      return;
    }

    try {
      setIsLoading(true);
      
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const promises = images.map(async (imageUrl, index) => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const fileName = `image-${index + 1}.${blob.type.split('/')[1] || 'jpg'}`;
          zip.file(fileName, blob);
        } catch (error) {
          console.error(`Failed to fetch image ${index + 1}:`, error);
        }
      });

      await Promise.all(promises);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${customerName || 'repair'}-images-${bookingId || Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${images.length} images as ZIP file`);
    } catch (error) {
      console.error('Bulk download error:', error);
      toast.error('Failed to download images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(bookingId);
      
      const response = await adminService.updateAppointmentStatus(bookingId, { 
        status: newStatus 
      });
      
      if (response.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        
        // Update the booking in the state
        setDashboardData(prev => ({
          ...prev,
          recentAppointments: prev.recentAppointments.map(booking =>
            booking.id === bookingId 
              ? { ...booking, status: newStatus }
              : booking
          )
        }));
        
        // Refresh dashboard data to update statistics
        await fetchDashboardData();
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.message || 'Failed to update booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteConfirm = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    try {
      setLoading(true);
      
      const response = await adminService.deleteAppointment(bookingToDelete.id);
      
      if (response.success) {
        toast.success('Booking deleted successfully');
        
        // Remove the booking from the state completely
        setDashboardData(prev => ({
          ...prev,
          recentAppointments: prev.recentAppointments.filter(booking => booking.id !== bookingToDelete.id),
          totalAppointments: prev.totalAppointments - 1
        }));
        
        // Refresh dashboard data to update statistics
        await fetchDashboardData();
      } else {
        throw new Error(response.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete booking');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  const handleViewDetails = async (booking) => {
    try {
      setViewDetailsLoading(true);
      
      // Fetch complete booking details
      const response = await adminService.getAppointment(booking.id);
      
      if (response.success) {
        setSelectedBooking(response.data);
        setViewDetailsModalOpen(true);
      } else {
        throw new Error(response.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('View details error:', error);
      toast.error(error.message || 'Failed to load booking details');
    } finally {
      setViewDetailsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.statistics.totalAppointments,
      icon: FaCalendarCheck,
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'Pending Bookings',
      value: dashboardData.statistics.pendingAppointments,
      icon: FaUsers,
      color: 'yellow',
      change: '+5%'
    },
    {
      title: 'Completed Bookings',
      value: dashboardData.statistics.completedAppointments,
      icon: FaRupeeSign,
      color: 'green',
      change: '+18%'
    },
    {
      title: 'Monthly Bookings',
      value: dashboardData.statistics.monthlyAppointments,
      icon: FaTools,
      color: 'red',
      change: '+8%'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'bookings', label: 'Bookings', icon: FaCalendarCheck },
    { id: 'repairs', label: 'Repairs', icon: FaTools },
    { id: 'portfolio', label: 'Portfolio', icon: FaImage },
    { id: 'gallery', label: 'Gallery', icon: FaImage },
    { id: 'gallery-photos', label: 'Gallery Photos', icon: FaImage },
    // { id: 'offers', label: 'Offer Management', icon: FaGift }, // Disabled temporarily
    { id: 'team', label: 'Team Management', icon: FaUsers },
    { id: 'contacts', label: 'Messages', icon: FaEnvelope }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-outline">
                <FaDownload className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                  <button className="btn-outline">
                    <FaPlus className="w-4 h-4 mr-2" />
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {(dashboardData.recentAppointments || [])
                    .filter(booking => booking.status !== 'cancelled')
                    .slice(0, 5)
                    .map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600">{formatServiceType(booking.serviceType)}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-xs text-gray-500">📞 {booking.phone}</p>
                          <p className="text-xs text-gray-500">📅 {formatDate(booking.createdAt)}</p>
                        </div>
                        {booking.message && (
                          <p className="text-xs text-gray-600 mt-1">{booking.message}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          disabled={updatingStatus === booking.id}
                          className={`px-2 py-1 text-xs rounded-full border-0 font-medium ${
                            booking.status === 'pending' ? 'bg-accent-100 text-accent-800' :
                            booking.status === 'confirmed' ? 'bg-primary-100 text-primary-800' :
                            booking.status === 'in_progress' ? 'bg-secondary-100 text-secondary-800' :
                            booking.status === 'completed' ? 'bg-secondary-100 text-secondary-800' :
                            'bg-gray-100 text-gray-800'
                          } ${updatingStatus === booking.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          title="View Details"
                          onClick={() => handleViewDetails(booking)}
                          disabled={viewDetailsLoading}
                        >
                          {viewDetailsLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                          ) : (
                            <FaEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Repair Requests */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Repair Requests</h3>
                  <button className="btn-outline">
                    <FaPlus className="w-4 h-4 mr-2" />
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {(dashboardData.recentAppointments || [])
                    .filter(appointment => appointment.serviceType === 'repair_maintenance' && appointment.status !== 'cancelled')
                    .slice(0, 5)
                    .map((repair, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{repair.name}</p>
                        <p className="text-sm text-gray-600">{formatServiceType(repair.serviceType)}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-xs text-gray-500">📞 {repair.phone}</p>
                          <p className="text-xs text-gray-500">📅 {formatDate(repair.createdAt)}</p>
                        </div>
                        {repair.message && (
                          <p className="text-xs text-gray-600 mt-1">{repair.message}</p>
                        )}
                        {/* Mini Photo Indicators */}
                        {repair.images && repair.images.length > 0 && (
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-blue-600">📸</span>
                              <span className="text-xs text-blue-600 font-medium">{repair.images.length} photo{repair.images.length > 1 ? 's' : ''}</span>
                            </div>
                            <button
                              onClick={() => downloadAllImages(repair.images, repair.name, repair.id)}
                              className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded hover:bg-blue-100 transition-colors"
                              title="Download all images"
                              disabled={isLoading}
                            >
                              <FaDownload className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={repair.status}
                          onChange={(e) => handleStatusUpdate(repair.id, e.target.value)}
                          disabled={updatingStatus === repair.id}
                          className={`px-2 py-1 text-xs rounded-full border-0 font-medium ${
                            repair.status === 'pending' ? 'bg-accent-100 text-accent-800' :
                            repair.status === 'confirmed' ? 'bg-primary-100 text-primary-800' :
                            repair.status === 'in_progress' ? 'bg-secondary-100 text-secondary-800' :
                            repair.status === 'completed' ? 'bg-secondary-100 text-secondary-800' :
                            'bg-gray-100 text-gray-800'
                          } ${updatingStatus === repair.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          title="View Details"
                          onClick={() => handleViewDetails(repair)}
                          disabled={viewDetailsLoading}
                        >
                          {viewDetailsLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                          ) : (
                            <FaEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  {(dashboardData.recentAppointments || []).filter(appointment => appointment.serviceType === 'repair_maintenance' && appointment.status !== 'cancelled').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaTools className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No repair requests found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                <div className="flex space-x-2">
                  <select className="input-field">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                  </select>
                  <button className="btn-primary">
                    <FaPlus className="w-4 h-4 mr-2" />
                    New Booking
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(dashboardData.recentAppointments || [])
                      .filter(booking => booking.status !== 'cancelled')
                      .map((booking, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                            <div className="text-sm text-gray-500">{booking.address}</div>
                            {booking.municipality && (
                              <div className="text-xs text-gray-400">{booking.municipality}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">📞 {booking.phone}</div>
                            {booking.email && (
                              <div className="text-sm text-gray-500">📧 {booking.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{formatServiceType(booking.serviceType)}</div>
                            {booking.message && (
                              <div className="text-xs text-gray-500 max-w-md" title={booking.message}>
                                💬 {booking.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(booking.appointmentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                            disabled={updatingStatus === booking.id}
                            className={`px-2 py-1 text-xs rounded-full border-0 font-medium ${
                              booking.status === 'pending' ? 'bg-accent-100 text-accent-800' :
                              booking.status === 'confirmed' ? 'bg-primary-100 text-primary-800' :
                              booking.status === 'in_progress' ? 'bg-secondary-100 text-secondary-800' :
                              booking.status === 'completed' ? 'bg-secondary-100 text-secondary-800' :
                              'bg-gray-100 text-gray-800'
                            } ${updatingStatus === booking.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                              title="View Details"
                              onClick={() => handleViewDetails(booking)}
                              disabled={viewDetailsLoading}
                            >
                              {viewDetailsLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-300 border-t-primary-600"></div>
                              ) : (
                                <FaEye className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDeleteConfirm(booking)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete Booking"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'repairs' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Repair Requests</h3>
                <select className="input-field">
                  <option>All Priority</option>
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="space-y-4">
                {(dashboardData.recentAppointments || [])
                  .filter(appointment => appointment.serviceType === 'repair_maintenance' && appointment.status !== 'cancelled')
                  .map((repair, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{repair.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            repair.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            repair.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {repair.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{formatServiceType(repair.serviceType)}</p>
                        {repair.message && (
                          <p className="text-sm text-gray-500 mb-2">{repair.message}</p>
                        )}
                        
                        {/* Photos Section */}
                        {repair.images && repair.images.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-700">📸 Uploaded Photos ({repair.images.length})</span>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => downloadAllImages(repair.images, repair.name, repair.id)}
                                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors flex items-center space-x-1"
                                  title="Download all images as ZIP"
                                  disabled={isLoading}
                                >
                                  <FaDownload className="w-3 h-3" />
                                  <span>All</span>
                                </button>
                              </div>
                            </div>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                              {repair.images.slice(0, 3).map((photo, photoIndex) => (
                                <div key={photoIndex} className="relative flex-shrink-0 group">
                                  <img
                                    src={photo}
                                    alt={`Repair documentation ${photoIndex + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => window.open(photo, '_blank')}
                                  />
                                  <button
                                    onClick={() => downloadImage(photo, `repair-${repair.id}-image-${photoIndex + 1}.jpg`)}
                                    className="absolute top-0 right-0 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform translate-x-1 -translate-y-1"
                                    title="Download this image"
                                  >
                                    <FaDownload className="w-2 h-2" />
                                  </button>
                                </div>
                              ))}
                              {repair.images.length > 3 && (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-gray-500 font-medium">+{repair.images.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>📞 {repair.phone}</span>
                          {repair.email && <span>📧 {repair.email}</span>}
                          <span>📍 {repair.address}</span>
                          <span>📅 {formatDate(repair.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={repair.status}
                          onChange={(e) => handleStatusUpdate(repair.id, e.target.value)}
                          disabled={updatingStatus === repair.id}
                          className={`px-2 py-1 text-xs rounded border font-medium ${
                            repair.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            repair.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            repair.status === 'in_progress' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            repair.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-gray-100 text-gray-800 border-gray-300'
                          } ${updatingStatus === repair.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="btn-outline text-sm"
                          title="View Details"
                          onClick={() => handleViewDetails(repair)}
                          disabled={viewDetailsLoading}
                        >
                          {viewDetailsLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-300 border-t-primary-600"></div>
                          ) : (
                            'View Details'
                          )}
                        </button>
                        <button 
                          onClick={() => handleDeleteConfirm(repair)}
                          className="btn-secondary text-sm text-red-600 border-red-300 hover:bg-red-50"
                          title="Delete Repair Request"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(dashboardData.recentAppointments || []).filter(appointment => appointment.serviceType === 'repair_maintenance' && appointment.status !== 'cancelled').length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaTools className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No repair requests</h3>
                    <p>No repair and maintenance requests have been submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <TeamManagement />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioManager />
          )}

          {activeTab === 'gallery' && (
            <GalleryManagement />
          )}

          {activeTab === 'gallery-photos' && (
            <GalleryPhotoManagement />
          )}

          {/* Offers tab disabled temporarily */}
          {/* {activeTab === 'offers' && (
            <OfferManagement />
          )} */}

          {activeTab === 'contacts' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Contact Messages</h3>
                <select className="input-field">
                  <option>All Types</option>
                  <option>Consultation</option>
                  <option>3D Design</option>
                  <option>Full Package</option>
                  <option>Repair</option>
                </select>
              </div>
              <div className="space-y-4">
                {(dashboardData.recentAppointments || [])
                  .filter(appointment => appointment.message && appointment.message.length > 0 && appointment.status !== 'cancelled')
                  .map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{contact.name}</h4>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {formatServiceType(contact.serviceType)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                        <p className="text-sm text-gray-600 mb-3">{contact.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📞 {contact.phone}</span>
                          {contact.email && <span>📧 {contact.email}</span>}
                          <span>📍 {contact.address}</span>
                          <span>📅 {formatDate(contact.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-outline">Reply</button>
                        <button className="btn-secondary">Mark Read</button>
                      </div>
                    </div>
                  </div>
                ))}
                {(dashboardData.recentAppointments || []).filter(appointment => appointment.message && appointment.message.length > 0 && appointment.status !== 'cancelled').length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaEnvelope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No messages</h3>
                    <p>No appointments with messages have been submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detailed View Modal */}
      {viewDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setViewDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedBooking.name}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.phone}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.email || 'Not provided'}</p>
                    <p><span className="font-medium">Address:</span> {selectedBooking.address || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Service Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Service Type:</span> {formatServiceType(selectedBooking.serviceType)}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedBooking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        selectedBooking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                        selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Created:</span> {formatDate(selectedBooking.createdAt)}</p>
                    <p><span className="font-medium">Updated:</span> {formatDate(selectedBooking.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Message/Description */}
              {selectedBooking.message && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBooking.message}</p>
                </div>
              )}

              {/* Photos Section */}
              {selectedBooking.images && selectedBooking.images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900">Photos ({selectedBooking.images.length})</h4>
                    <button
                      onClick={() => downloadAllImages(selectedBooking.images, selectedBooking.name, selectedBooking.id)}
                      className="btn-primary text-sm flex items-center space-x-2"
                      disabled={isLoading}
                    >
                      <FaDownload className="w-4 h-4" />
                      <span>Download All Images</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedBooking.images.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Repair documentation ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => window.open(photo, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => downloadImage(photo, `${selectedBooking.name}-image-${index + 1}.jpg`)}
                            className="bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                            title="Download this image"
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1} / {selectedBooking.images.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Booking ID:</span> {selectedBooking.id}</p>
                    {selectedBooking.preferredDate && (
                      <p><span className="font-medium">Preferred Date:</span> {formatDate(selectedBooking.preferredDate)}</p>
                    )}
                    {selectedBooking.urgency && (
                      <p><span className="font-medium">Urgency:</span> {selectedBooking.urgency}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Actions</h4>
                  <div className="space-y-2">
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => {
                        handleStatusUpdate(selectedBooking.id, e.target.value);
                        setSelectedBooking({...selectedBooking, status: e.target.value});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => {
                        handleDeleteConfirm(selectedBooking);
                        setViewDetailsModalOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Booking</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            {bookingToDelete && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{bookingToDelete.name}</p>
                <p className="text-sm text-gray-600">{formatServiceType(bookingToDelete.serviceType)}</p>
                <p className="text-sm text-gray-500">📞 {bookingToDelete.phone}</p>
                <p className="text-sm text-gray-500">📅 {formatDate(bookingToDelete.appointmentDate)}</p>
              </div>
            )}
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this booking? This will mark the booking as cancelled and cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBooking}
                disabled={isLoading}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
