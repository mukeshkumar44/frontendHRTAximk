import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import driverService from '../../services/driverService';
import { useAuth } from '../../context/AuthContext';

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
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const navigate = useNavigate();

  // Fetch driver data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const taxiRes = await driverService.getMyTaxi();
        setTaxiData(taxiRes.data);
        
        if (taxiRes.data?.status === 'approved') {
          const bookingsRes = await driverService.getMyBookings();
          setBookings(bookingsRes.data.data || []);
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle online status toggle
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast.success(`You are now ${!isOnline ? 'online' : 'offline'}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render different states based on taxi status
  if (!taxiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Taxi Registered</h2>
          <p className="text-gray-600 mb-6">Register your taxi to start accepting rides</p>
          <Link
            to="/driver/register-taxi"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register Taxi
          </Link>
        </div>
      </div>
    );
  }

  if (taxiData.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Under Review</h2>
          <p className="text-gray-600">Your taxi registration is being reviewed. We'll notify you once approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || 'Driver'}</p>
            </div>
            <button
              onClick={toggleOnlineStatus}
              className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-medium ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-96 w-full">
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
                  <Popup>Your Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Ride Requests</h2>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {booking.passenger?.name || 'Passenger'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(booking._id)}
                            className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <button
                          onClick={() => handleCompleteBooking(booking._id)}
                          className="w-full bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Complete Ride
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No ride requests yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Handler functions
  async function handleAcceptBooking(bookingId) {
    try {
      await driverService.acceptBooking(bookingId);
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: 'accepted' } : b
      ));
      toast.success('Ride accepted');
    } catch (error) {
      toast.error('Failed to accept ride');
    }
  }

  async function handleRejectBooking(bookingId) {
    try {
      await driverService.rejectBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      toast.success('Ride rejected');
    } catch (error) {
      toast.error('Failed to reject ride');
    }
  }

  async function handleCompleteBooking(bookingId) {
    try {
      await driverService.completeBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      toast.success('Ride completed');
    } catch (error) {
      toast.error('Failed to complete ride');
    }
  }
};

export default DriverDashboard;
