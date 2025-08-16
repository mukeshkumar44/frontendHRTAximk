import React from 'react';

const Services = () => {
  return (
    <div className="bg-gray-50 mt-10 ">
      {/* Header Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto px-4">
          Explore our stunning travel destinations for unforgettable experiences
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Travel Packages */}
          <div className="bg-orange-100 rounded-lg p-8 h-64">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Travel Packages</h3>
            <p className="text-gray-700 leading-relaxed">
              Discover exciting travel packages including detailed itineraries for unforgettable journeys to stunning destinations.
            </p>
          </div>

          {/* Taxi Booking */}
          <div className="bg-orange-100 rounded-lg p-8 h-64">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Taxi Booking</h3>
            <p className="text-gray-700 leading-relaxed">
              Effortlessly book your taxi online with our user-friendly booking system for a seamless experience.
            </p>
          </div>
        </div>

        {/* Taxi Images Grid */}
        <div className="grid grid-cols-2 gap-4 mb-16">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1557655562-40e37f54a070?auto=format&fit=crop&w=861&h=489" 
              alt="Taxi at night" 
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551560274-3c1b29a55ce5?auto=format&fit=crop&w=861&h=489" 
              alt="Taxi at night" 
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1644062888317-704bfa768be4?auto=format&fit=crop&w=328&h=342" 
              alt="Taxi during day" 
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1679365719769-6452e32e2106?auto=format&fit=crop&w=328&h=342" 
              alt="Taxi during day" 
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-center text-gray-600 mb-12">
            Read what our satisfied clients say about our services
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8  w-full ">
            {/* Review 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "HR Taxi provided an unforgettable experience during our Kashmir tour. The itinerary was well-planned and the service was top-notch. Will definitely book again!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Jane Smith</p>
                  <p className="text-gray-500 text-sm">Los Angeles</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The service was exceptional! Highly recommend HR Taxi for all travel needs."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">John Doe</p>
                  <p className="text-gray-500 text-sm">New York</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="relative bg-cover bg-center  rounded-lg overflow-hidden" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1679365719769-6452e32e2106?auto=format&fit=crop&w=328&h=342)' }}>
          <div className="bg-black bg-opacity-60 p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Contact Us</h2>
              <p className="text-white text-center mb-8">
                Get in touch for inquiries about our taxi services, tours, and booking assistance. We're here to help!
              </p>
              
              <form className="bg-white rounded-lg p-6">
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Your First Name" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="mb-4">
                  <input 
                    type="email" 
                    placeholder="Your Email Address" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Your Phone Number" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="mb-6">
                  <textarea 
                    placeholder="Type your message here" 
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
                >
                  Submit Your Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Services;
