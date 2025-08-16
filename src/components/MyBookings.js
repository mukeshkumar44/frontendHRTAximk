import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user's bookings
        const response = await bookingService.getBookings();
        // यहां परिवर्तन करें - सुनिश्चित करें कि bookings एक array है
        setBookings(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // Handle booking cancellation - MOVED INSIDE COMPONENT
  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      // Refresh bookings after cancellation
      const response = await bookingService.getBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">My Bookings</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-lg text-gray-600">You don't have any bookings yet.</p>
            <button 
              onClick={() => navigate('/booking')} 
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Book a Taxi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{booking.pickupLocation} to {booking.dropLocation}</h3>
                    <p className="text-sm text-gray-600">{new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex">
                    <span className="text-gray-500 w-24">Passengers:</span>
                    <span className="font-medium">{booking.passengers}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Vehicle:</span>
                    <span className="font-medium">{booking.vehicleType}</span>
                  </div>
                  {booking.fare && (
                    <div className="flex">
                      <span className="text-gray-500 w-24">Fare:</span>
                      <span className="font-medium">₹{booking.fare}</span>
                    </div>
                  )}
                </div>
                
                {booking.status === 'pending' && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleCancelBooking(booking._id)} 
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for status color
const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default MyBookings;