import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
<<<<<<< HEAD
import { FiUsers, FiCalendar, FiTruck, FiPackage, FiAlertCircle, FiClock, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
=======
import { 
  FiUsers, 
  FiCalendar, 
  FiTruck, 
  FiPackage, 
  FiImage,
  FiAlertCircle, 
  FiDollarSign 
} from 'react-icons/fi';
>>>>>>> e609d61 (first commit)

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalTaxis: 0,
    totalPackages: 0,
    pendingBookings: 0,
    pendingTaxiApprovals: 0,
    totalRevenue: 0,
    recentBookings: [],
    recentUsers: [],
    completedBookings: 0,
    activeDrivers: 0,
    upcomingTours: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('overview');
=======
>>>>>>> e609d61 (first commit)
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || user.role !== 'admin') {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/');
      }
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
<<<<<<< HEAD
        console.log('Dashboard API Response:', response); // Debug log
=======
>>>>>>> e609d61 (first commit)
        
        if (response.data && response.data.success) {
          setStats({
            totalUsers: response.data.data.totalUsers || 0,
            totalBookings: response.data.data.totalBookings || 0,
            totalTaxis: response.data.data.totalTaxis || 0,
            totalPackages: response.data.data.totalPackages || 0,
            pendingBookings: response.data.data.pendingBookings || 0,
            pendingTaxiApprovals: response.data.data.pendingTaxiApprovals || 0,
            totalRevenue: response.data.data.totalRevenue || 0,
            recentBookings: response.data.data.recentBookings || [],
            recentUsers: response.data.data.recentUsers || [],
            completedBookings: response.data.data.completedBookings || 0,
            activeDrivers: response.data.data.activeDrivers || 0,
            upcomingTours: response.data.data.upcomingTours || 0
          });
        } else {
          console.error('Invalid response format:', response.data);
          setError('Invalid data received from server');
        }
      } catch (err) {
        console.error('Dashboard data error:', err);
<<<<<<< HEAD
        let errorMessage = 'Failed to load dashboard data. Please try again later.';
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          
          if (err.response.data && err.response.data.error) {
            errorMessage += `\nError: ${err.response.data.error.message || 'Unknown error'}`;
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', err.message);
          errorMessage = `Error: ${err.message}`;
        }
        
        setError(errorMessage);
=======
        setError('Failed to load dashboard data. Please try again later.');
>>>>>>> e609d61 (first commit)
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
    fetchDashboardData();
<<<<<<< HEAD
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
=======
>>>>>>> e609d61 (first commit)
  }, [navigate]);

  const StatCard = ({ icon: Icon, title, value, color, onClick, trend, trendText }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer ${onClick ? 'hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendText}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, color, onClick }) => (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <div className="flex items-center justify-center mb-2">
            <FiAlertCircle className="h-6 w-6 mr-2" />
            <h3 className="font-medium">Error Loading Dashboard</h3>
          </div>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={FiUsers} 
            title="Total Users" 
            value={stats.totalUsers}
            color="blue"
            trend={5.2}
            trendText="from last month"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard 
            icon={FiCalendar} 
            title="Total Bookings" 
            value={stats.totalBookings}
            color="green"
            trend={12.5}
            trendText="from last month"
            onClick={() => navigate('/admin/bookings')}
          />
          <StatCard 
            icon={FiTruck} 
            title="Taxis" 
            value={`${stats.totalTaxis} (${stats.pendingTaxiApprovals} pending)`}
            color="purple"
            onClick={() => navigate('/admin/taxis')}
          />
          <StatCard 
            icon={FiDollarSign} 
            title="Total Revenue" 
            value={new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(stats.totalRevenue || 0)}
            color="orange"
            trend={8.3}
            trendText="from last month"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              icon={FiPackage}
              title="Add New Package"
              description="Create a new tour package"
              color="bg-indigo-500"
              onClick={() => navigate('/admin/tour-packages/new')}
            />
            <QuickAction
              icon={FiUsers}
              title="Manage Users"
              description="View and manage users"
              color="bg-blue-500"
              onClick={() => navigate('/admin/users')}
            />
            <QuickAction
              icon={FiTruck}
              title="Approve Taxis"
              description={`${stats.pendingTaxiApprovals} pending approvals`}
              color="bg-purple-500"
              onClick={() => navigate('/admin/taxis?status=pending')}
            />
            <QuickAction
<<<<<<< HEAD
              icon={FiCalendar}
              title="View Bookings"
              description="Manage all bookings"
              color="bg-green-500"
              onClick={() => navigate('/admin/bookings')}
=======
              icon={FiImage}
              title="Manage Gallery"
              description="Upload and manage images"
              color="bg-pink-500"
              onClick={() => navigate('/admin/gallery')}
>>>>>>> e609d61 (first commit)
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <div key={booking._id} className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/bookings/${booking._id}`)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.user?.name || 'Guest'}</p>
                        <p className="text-sm text-gray-500">{booking.tourPackage?.title || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                          }).format(booking.totalAmount || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent bookings found
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
              <button 
                onClick={() => navigate('/admin/bookings')}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View all bookings →
              </button>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">New Users</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div key={user._id} className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/users/${user._id}`)}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{user.name || 'Guest User'}</p>
                        <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent users found
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
              <button 
                onClick={() => navigate('/admin/users')}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View all users →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default AdminDashboard;
=======
export default AdminDashboard;
>>>>>>> e609d61 (first commit)
