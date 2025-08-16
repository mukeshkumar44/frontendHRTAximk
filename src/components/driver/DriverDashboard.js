import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import driverService from '../../services/driverService';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DriverDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [taxiData, setTaxiData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [currentBooking, setCurrentBooking] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Fetch taxi and booking data
  useEffect(() => {
    if (!user) return;
    
    const fetchDriverData = async () => {
      console.log('Fetching driver data for user:', user);
      try {
        setIsLoading(true);
        // Get taxi data
        const taxiResponse = await driverService.getMyTaxi();
<<<<<<< HEAD
        console.log('Taxi data received:', taxiResponse.data);
        setTaxiData(taxiResponse.data);

        // If taxi is approved, fetch bookings and initialize WebSocket
        if (taxiResponse.data?.status === 'approved') {
=======
        
        // Extract the taxi data from response (handling both nested and flat structures)
        const taxiData = taxiResponse.data?.data || taxiResponse.data;
        
        if (!taxiData) {
          setTaxiData(null);
          return;
        }
        
        setTaxiData(taxiData);
        
        // Check if taxi is approved
        const isTaxiApproved = !!taxiData.isApproved || taxiData.status === 'approved';
        if (isTaxiApproved) {
>>>>>>> e609d61 (first commit)
          console.log('Taxi approved, fetching bookings...');
          const bookingsResponse = await driverService.getMyBookings();
          console.log('Bookings received:', bookingsResponse.data);
          setBookings(bookingsResponse.data || []);
          
          // Initialize WebSocket connection
          console.log('Initializing WebSocket...');
          const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
          setSocket(newSocket);

          // Listen for new bookings
          newSocket.on('connect', () => {
            console.log('WebSocket connected');
          });

          newSocket.on('error', (error) => {
            console.error('WebSocket error:', error);
          });

          newSocket.on('newBooking', (booking) => {
            console.log('New booking received:', booking);
            toast.info(`New booking received! From: ${booking.pickupLocation?.address || 'Unknown location'}`);
            setBookings(prev => [booking, ...prev]);
          });

          // Set up location tracking if geolocation is available
          if (navigator.geolocation) {
            console.log('Setting up geolocation...');
            navigator.geolocation.watchPosition(
              handleGeolocationSuccess,
              handleGeolocationError,
              { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
          } else {
            console.warn('Geolocation is not supported by this browser');
          }
        }
      } catch (error) {
        console.error('Error in fetchDriverData:', error);
        toast.error('Failed to load driver data');
      } finally {
        console.log('Finished loading data, setting isLoading to false');
        setIsLoading(false);
      }
    };

    fetchDriverData();

    // Clean up WebSocket on unmount
    return () => {
      console.log('Cleaning up WebSocket...');
      if (socket) {
        socket.off('newBooking');
        socket.disconnect();
      }
    };
  }, [user]);

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    // Using setTimeout to avoid React state update during render
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  const handleGeolocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const location = { lat: latitude, lng: longitude };
    setCurrentLocation(location);
    
    // Send location to server if online and socket is available
    if (isOnline && user?.id && socket) {
      socket.emit('driverLocationUpdate', { 
        driverId: user.id,
        location,
        status: isOnline ? 'available' : 'offline'
      });
    }
  };

  const handleGeolocationError = (error) => {
    console.error('Error getting location:', error);
    let errorMessage = 'Unable to retrieve your location. Using default location.';
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied. Please enable location services for better experience.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'The request to get your location timed out.';
        break;
    }
    
    toast.warn(errorMessage);
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await driverService.toggleOnlineStatus(newStatus);
      setIsOnline(newStatus);
      toast.success(`You are now ${newStatus ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('Error toggling online status:', error);
      toast.error('Failed to update online status');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await driverService.updateBookingStatus(bookingId, 'accepted');
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'accepted' } : booking
      ));
      toast.success('Booking accepted successfully');
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await driverService.updateBookingStatus(bookingId, 'completed');
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      setCurrentBooking(null);
      toast.success('Booking marked as completed');
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Failed to complete booking');
    }
  };

<<<<<<< HEAD
=======
  const handleRejectBooking = async (bookingId) => {
    try {
      await driverService.updateBookingStatus(bookingId, 'rejected');
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      toast.success('Booking rejected');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    }
  };

>>>>>>> e609d61 (first commit)
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // No taxi registered state
  if (!taxiData) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Taxi Registered</h2>
        <p className="text-gray-600 mb-6">You need to register a taxi before accessing the driver dashboard.</p>
        <div className="flex space-x-4">
          <Link
            to="/register-taxi"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Register Taxi
          </Link>
          <button
            onClick={logout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // Taxi pending approval state
  if (taxiData.status === 'pending') {
=======
  // Taxi pending approval state (check both isApproved and status for backward compatibility)
  const isTaxiApproved = taxiData.isApproved || taxiData.status === 'approved';
  if (!isTaxiApproved) {
>>>>>>> e609d61 (first commit)
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
        <h2 className="text-xl font-bold text-yellow-800 mb-3">Taxi Registration Pending Approval</h2>
        <p className="text-yellow-700 mb-4">
          Your taxi registration is under review by our admin team. You'll be able to access the driver dashboard once approved.
        </p>
        <div className="bg-yellow-100 p-3 rounded-md mb-4">
          <p className="text-yellow-800">
            <span className="font-semibold">Status:</span> Pending Approval
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

<<<<<<< HEAD
  // Taxi rejected state
  if (taxiData.status === 'rejected') {
=======
  // Taxi rejected state - we're not using this state anymore as we're using isApproved boolean
  if (taxiData.rejectionReason) {
>>>>>>> e609d61 (first commit)
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border-l-4 border-red-400 rounded-md">
        <h2 className="text-xl font-bold text-red-800 mb-3">Taxi Registration Rejected</h2>
        <p className="text-red-700 mb-2">
          Your taxi registration has been rejected. 
          <span className="font-semibold">
            Reason: {taxiData.rejectionReason || 'No reason provided'}
          </span>
        </p>
        <p className="text-red-700 mb-4">
          Please contact support or update your registration details and try again.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/register-taxi"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Update Registration
          </Link>
          <button
            onClick={logout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Main driver dashboard (taxi approved)
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name || 'Driver'}!</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={toggleOnlineStatus}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isOnline 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Map */}
        <div className="lg:col-span-2">
<<<<<<< HEAD
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Live Location</h2>
            </div>
            <div className="h-[500px] w-full">
              <MapContainer 
                center={currentLocation} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
=======
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Live Location & Navigation
              </h2>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isOnline ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="h-[500px] w-full relative">
              {/* Map Controls */}
              <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setCurrentLocation({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                          });
                        },
                        (err) => console.error('Error getting location:', err)
                      );
                    }
                  }}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  title="Center on my location"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <MapContainer 
                center={currentLocation} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                className="rounded-b-lg"
>>>>>>> e609d61 (first commit)
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
<<<<<<< HEAD
                <Marker position={currentLocation}>
                  <Popup>Your current location</Popup>
                </Marker>
                {currentBooking && (
                  <>
=======
                
                {/* Current Location Marker */}
                <Marker 
                  position={currentLocation}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: `
                      <div class="relative">
                        <div class="absolute -left-3 -top-3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                        <div class="absolute -left-1.5 -top-1.5 w-3 h-3 bg-white rounded-full animate-ping"></div>
                      </div>
                    `,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup className="custom-popup">
                    <div className="text-sm font-medium">Your Current Location</div>
                    <div className="text-xs text-gray-500 mt-1">Accuracy: ~10m</div>
                  </Popup>
                </Marker>
                {currentBooking && (
                  <>
                    {/* Pickup Location Marker */}
>>>>>>> e609d61 (first commit)
                    <Marker 
                      position={[
                        currentBooking.pickupLocation?.coordinates?.[1] || 0,
                        currentBooking.pickupLocation?.coordinates?.[0] || 0
                      ]}
<<<<<<< HEAD
                    >
                      <Popup>Pickup Location</Popup>
                    </Marker>
=======
                      icon={L.divIcon({
                        className: 'pickup-marker',
                        html: `
                          <div class="relative">
                            <div class="w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium text-gray-800 whitespace-nowrap shadow-sm">
                              Pickup
                            </div>
                          </div>
                        `,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                      })}
                    >
                      <Popup className="custom-popup">
                        <div className="text-sm font-medium">Pickup Location</div>
                        <div className="text-xs text-gray-500 mt-1">{currentBooking.pickupLocation?.address || 'No address provided'}</div>
                      </Popup>
                    </Marker>
                    
                    {/* Route Line */}
>>>>>>> e609d61 (first commit)
                    <Polyline 
                      positions={[
                        currentLocation,
                        [
                          currentBooking.pickupLocation?.coordinates?.[1] || 0,
                          currentBooking.pickupLocation?.coordinates?.[0] || 0
                        ]
                      ]} 
<<<<<<< HEAD
                      color="blue"
                    />
=======
                      color="#3B82F6"
                      weight={4}
                      opacity={0.8}
                    />
                    
                    {/* ETA Badge */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-full shadow-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-gray-800">ETA: 8 min</span>
                    </div>
>>>>>>> e609d61 (first commit)
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right column - Bookings */}
        <div className="space-y-6">
<<<<<<< HEAD
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Active Bookings</h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center my-6">No active bookings</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-gray-900 mb-2">Booking #{booking.bookingNumber}</h3>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <p><span className="font-medium">From:</span> {booking.pickupLocation?.address || 'N/A'}</p>
                        <p><span className="font-medium">To:</span> {booking.dropoffLocation?.address || 'N/A'}</p>
                        <p><span className="font-medium">Status:</span> {booking.status}</p>
                      </div>
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptBooking(booking._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
                          >
                            Accept
                          </button>
                        )}
                        {booking.status === 'accepted' && (
                          <button
                            onClick={() => handleCompleteBooking(booking._id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Taxi Info */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Taxi Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium">Driver:</span> {taxiData.driverName}</p>
                <p><span className="font-medium">Vehicle:</span> {taxiData.vehicleModel} ({taxiData.vehicleNumber})</p>
                <p><span className="font-medium">Type:</span> {taxiData.vehicleType}</p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    taxiData.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {taxiData.status}
                  </span>
                </p>
=======
          {/* Ride Requests Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                </svg>
                Ride Requests
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {bookings.length} Active
              </span>
            </div>
            
            {bookings.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50">
                  <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-medium text-gray-900">No ride requests</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any active ride requests at the moment.</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Check for rides
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 flex items-center">
                              {booking.passenger?.name || 'Passenger'}
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {booking.status}
                              </span>
                            </h3>
                            <div className="flex items-center mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-xs text-gray-500">4.0</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">Pickup</p>
                              <p className="text-sm text-gray-500">{booking.pickupLocation?.address || 'Location not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">Drop-off</p>
                              <p className="text-sm text-gray-500">{booking.dropoffLocation?.address || 'Location not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>5 min away</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">${booking.fare?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-3">
                          <button
                            onClick={() => handleAcceptBooking(booking._id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Taxi Info Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">My Taxi</h2>
                  <p className="text-blue-100 text-sm">Vehicle Information</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
                  {taxiData?.isApproved ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0 2 2 0 00-4 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{taxiData?.vehicleModel || 'Not specified'}</h3>
                  <p className="text-sm text-gray-500 mb-2">{taxiData?.vehicleNumber || 'No plate number'}</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-gray-600">Registration: <span className="font-medium">{taxiData?.registrationYear || 'N/A'}</span></span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-gray-600">Capacity: <span className="font-medium">{taxiData?.seatingCapacity || 4} passengers</span></span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-gray-600">Status: <span className={`font-medium ${taxiData?.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                        {taxiData?.isApproved ? 'Active & Verified' : 'Pending Verification'}
                      </span></span>
                    </div>
                  </div>
                  
                  {!taxiData?.isApproved && taxiData?.rejectionReason && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-700">
                      <p className="font-medium">Verification Note:</p>
                      <p>{taxiData.rejectionReason}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => navigate('/edit-taxi')}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Info
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
                </div>
>>>>>>> e609d61 (first commit)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
