import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import driverService from '../../services/driverService';
import { useAuth } from '../../context/AuthContext';

// Configure default marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set default icon for all markers
L.Marker.prototype.options.icon = defaultIcon;

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [taxiData, setTaxiData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation] = useState({ 
    lat: 28.6139, 
    lng: 77.2090,
    address: 'New Delhi, India'
  });
  const navigate = useNavigate();

  // Toggle online status
  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await driverService.toggleOnlineStatus(newStatus);
      setIsOnline(newStatus);
      toast.success(`You are now ${newStatus ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Fetch driver data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching driver data...');
        setIsLoading(true);
        setError(null);
        
        // Get the user's profile
        const profileRes = await driverService.getProfile();
        console.log('User profile response:', profileRes);
        
        if (profileRes.data?.data) {
          const userData = profileRes.data.data;
          console.log('User data:', userData);
          console.log('Taxi data in user profile:', userData.taxi);
          
          // Check if user has a taxi (for drivers)
          if (userData.role === 'driver') {
            if (userData.taxi) {
              console.log('Taxi status:', userData.taxi.status);
              console.log('Taxi isApproved:', userData.taxi.isApproved);
              
              // Set the taxi data
              setTaxiData(userData.taxi);
              setIsOnline(userData.taxi.isOnline || false);
              
              // Check both status and isApproved for backward compatibility
              const isTaxiApproved = userData.taxi.status === 'approved' || userData.taxi.isApproved === true;
              console.log('Taxi approval status:', {
                status: userData.taxi.status,
                isApproved: userData.taxi.isApproved,
                finalApproval: isTaxiApproved
              });
              
              // Set taxi data regardless of approval status
              setTaxiData(userData.taxi);
              
              // Only fetch bookings if taxi is approved
              if (isTaxiApproved) {
                try {
                  const bookingsRes = await driverService.getMyBookings();
                  console.log('Bookings data:', bookingsRes);
                  setBookings(Array.isArray(bookingsRes?.data) ? bookingsRes.data : []);
                } catch (bookingError) {
                  console.error('Error fetching bookings:', bookingError);
                  toast.error('Could not load bookings');
                }
              }
            } else {
              // No taxi registered for this driver
              console.log('No taxi found for driver');
              setTaxiData(null);
            }
          } else {
            console.log('User is not a driver');
            toast.error('Access denied. Driver account required.');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('Failed to load driver data');
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error(error.message || 'Failed to load data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          
          {/* Online/Offline Toggle Button */}
          <button
            onClick={toggleOnlineStatus}
            className={`px-6 py-3 rounded-full font-medium text-white ${
              isOnline ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-200 shadow-md`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Driver Info */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Information</h2>
                {taxiData ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-sm text-gray-900">{user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vehicle Number</p>
                      <p className="mt-1 text-sm text-gray-900">{taxiData.vehicleNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vehicle Model</p>
                      <p className="mt-1 text-sm text-gray-900">{taxiData.vehicleModel || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        taxiData.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        taxiData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {taxiData.status || 'Not Registered'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-4">No taxi registered yet</p>
                    <button
                      onClick={() => navigate('/register-taxi')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register Taxi
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column - Map */}
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <MapContainer 
                  center={[currentLocation.lat, currentLocation.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[currentLocation.lat, currentLocation.lng]}>
                    <Popup>Your current location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
