import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleNewBooking = () => {
    navigate('/book-taxi');
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <button
          onClick={handleNewBooking}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Book a Taxi
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Recent Bookings</h2>
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Booking ID</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Pickup</th>
                  <th className="py-2 px-4 text-left">Destination</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b">
                    <td className="py-3 px-4">{booking.bookingId}</td>
                    <td className="py-3 px-4">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{booking.pickupLocation}</td>
                    <td className="py-3 px-4">{booking.destination}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewBooking(booking._id)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
            <button
              onClick={handleNewBooking}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Book Your First Ride
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/book-taxi')}
                className="text-blue-600 hover:underline"
              >
                Book a Taxi
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/profile')}
                className="text-blue-600 hover:underline"
              >
                Update Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/payment-methods')}
                className="text-blue-600 hover:underline"
              >
                Payment Methods
              </button>
            </li>
          </ul>
        </div>

        {/* Account Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
          <div className="space-y-2">
            <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone || 'Not provided'}</p>
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">Special Offers</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="font-medium">20% Off Your Next Ride</p>
              <p className="text-sm text-gray-600">Use code: WELCOME20</p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="font-medium">Free Upgrade to Premium</p>
              <p className="text-sm text-gray-600">On your 5th ride</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
