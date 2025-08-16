import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TaxiRegistration = () => {
  const [formData, setFormData] = useState({
    driverName: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleType: 'sedan',
    licenseNumber: '',
    phoneNumber: '',
    address: ''
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
<<<<<<< HEAD
  const [success, setSuccess] = useState(false);
=======
  const [success, setSuccess] = useState('');
>>>>>>> e609d61 (first commit)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append the document file
      if (documentFile) {
        formDataToSend.append('documents', documentFile);
      }
      
      const response = await fetch('http://localhost:5000/api/taxis/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type header when using FormData, let the browser set it with the correct boundary
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
      
<<<<<<< HEAD
      setSuccess(true);
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
=======
      setSuccess('Taxi registration submitted for approval! You will be redirected to check your status.');
      
      // Redirect to taxi status page after 2 seconds
      setTimeout(() => {
        navigate('/taxi-status');
>>>>>>> e609d61 (first commit)
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Taxi Registration</h2>
          <p className="text-gray-600">Please fill in your taxi details</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
<<<<<<< HEAD
            Registration successful! Redirecting...
=======
            {success}
>>>>>>> e609d61 (first commit)
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Driver Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver Name</label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
                placeholder="e.g., GJ01AB1234"
              />
            </div>

            {/* Vehicle Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
                placeholder="e.g., Swift Dzire"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
                placeholder="e.g., GJ0120191234567"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  required
                  placeholder="e.g., 9876543210"
                  pattern="[0-9]{10}"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">10-digit mobile number</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
                placeholder="Your complete address"
              ></textarea>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Documents (License, RC, etc.)
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  name="documents"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-yellow-50 file:text-yellow-700
                    hover:file:bg-yellow-100"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Upload scanned copies of your driving license, RC, and other relevant documents (PDF, DOC, JPG, PNG)
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Taxi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxiRegistration;