import React, { useState } from 'react';
import { bookingService } from '../services/api';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    pickupLocation: '',  // आवश्यक फ़ील्ड जोड़ा गया
    dropLocation: '',    // आवश्यक फ़ील्ड जोड़ा गया
    date: '',           // आवश्यक फ़ील्ड जोड़ा गया
    time: '',           // आवश्यक फ़ील्ड जोड़ा गया
    passengers: '',      // आवश्यक फ़ील्ड जोड़ा गया
    vehicleType: '',     // आवश्यक फ़ील्ड जोड़ा गया
    paymentMethod: 'cash' // आवश्यक फ़ील्ड जोड़ा गया, डिफ़ॉल्ट वैल्यू के साथ
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await bookingService.createBooking(formData);
      console.log('Booking created:', response.data);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        pickupLocation: '',
        dropLocation: '',
        date: '',
        time: '',
        passengers: '',
        vehicleType: '',
        paymentMethod: 'cash'
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://th.bing.com/th/id/OIP.nhsLfkTKM7jjEyqRfUjsdAHaEK?w=285&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 py-12 ">
       {/* Book Your Trip */}
        <div className="w-full bg-gray-900 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Book Your Trip</h2>
          <p className="text-white text-sm max-w-2xl mx-auto">
            Reserve your taxi and travel service seamlessly with our detailed booking system to plan your journey
          </p>
          <div className="flex justify-center mt-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-8 rounded-full transition duration-300">
              Reserve
            </button>
          </div>
        </div>

        {/* Contact Us */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">Contact Us</h2>
          <p className="text-white text-sm max-w-2xl mx-auto">
            Get in touch or drop us a message and we'll get back to you
          </p>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-xl">
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-gray-600">Your booking has been sent successfully. We'll get back to you soon.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
              >
                Make Another Booking
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              />
              
              {/* नए आवश्यक फ़ील्ड्स जोड़े गए */}
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Pickup Location"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                placeholder="Drop Location"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              />
              <div className="flex space-x-2 mb-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <input
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                placeholder="Number of Passengers"
                min="1"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              />
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="van">Van</option>
              </select>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                required
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
              
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Additional instructions or requirements"
                rows="4"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'} text-white font-semibold py-2 rounded-full transition duration-300 flex justify-center items-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Book Now'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className=" w-auto py-12 mt-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between ">
            {/* 📸 Image Section */}
            <div className="w-full md:w-1/2">
              <img
                src="https://th.bing.com/th/id/OIP.2uKdGNTS6IjQFrNfSYHSRAHaEK?w=296&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt="Taxi Travel"
                className="w-full h-auto shadow-lg"
              />
            </div>

            {/* 🌟 Review Section */}
            <div className="w-full bg-orange-600 h-[330px] md:w-1/2 text-white text-center md:text-left  flex flex-col justify-center items-center px-6">
              <div className="mb-2 text-xl">★★★★★</div>
              <p className="text-lg font-medium mb-4 text-center md:text-left">
                "Excellent service and highly professional booking experience. Highly recommend HRTaxi.com for your travel needs!"
              </p>
              <div className="flex items-center justify-center md:justify-start">
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
                  <img
                    src="/avatar.jpg"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Rahul Sharma</p>
                  <p className="text-sm">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
