import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUpload, FaFilePdf, FaFileImage } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

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
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    driverName: '',
    vehicleNumber: '',
    vehicleModel: '',
    licenseNumber: '',
    phoneNumber: '',
    address: '',
    documents: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        // Check file type
        if (!allowedTypes.includes(file.type)) {
          toast.error('केवल PDF, JPG और PNG फ़ाइलें स्वीकृत हैं', {
            position: 'top-center'
          });
          e.target.value = '';
          return;
        }
        
        // Check file size
        if (file.size > maxSize) {
          toast.error('फ़ाइल का साइज़ 10MB से कम होना चाहिए', {
            position: 'top-center'
          });
          e.target.value = '';
          return;
        }
        
        setDocumentFile(file);
        setError('');
        // Show success toast for file upload
        toast.success('फ़ाइल सफलतापूर्वक अपलोड की गई', {
          position: 'top-center'
        });
      }
    } catch (err) {
      console.error('File selection error:', err);
      toast.error('फ़ाइल चयन में त्रुटि हुई', {
        position: 'top-center'
      });
    }
  };

  // Enhanced form validation
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Driver Name validation
    if (!formData.driverName.trim()) {
      tempErrors.driverName = 'ड्राइवर का नाम आवश्यक है';
      isValid = false;
    }

    if (!formData.vehicleNumber?.trim()) {
      tempErrors.vehicleNumber = 'वाहन नंबर आवश्यक है';
      isValid = false;
    } else {
      const vehicleNumber = formData.vehicleNumber.trim().replace(/\s+/g, '').toUpperCase();
      const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}$/i;
      if (!vehicleRegex.test(vehicleNumber)) {
        tempErrors.vehicleNumber = 'कृपया वैध वाहन नंबर दर्ज करें (उदा: GJ01AB1234)';
        isValid = false;
      }
    }

    if (!formData.vehicleModel?.trim()) {
      tempErrors.vehicleModel = 'वाहन मॉडल आवश्यक है';
      isValid = false;
    }

    if (!formData.vehicleType) {
      tempErrors.vehicleType = 'वाहन प्रकार आवश्यक है';
      isValid = false;
    }

    if (!formData.licenseNumber?.trim()) {
      tempErrors.licenseNumber = 'लाइसेंस नंबर आवश्यक है';
      isValid = false;
    }

    if (!formData.phoneNumber?.trim()) {
      tempErrors.phoneNumber = 'फ़ोन नंबर आवश्यक है';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = 'कृपया 10 अंकों का वैध फ़ोन नंबर दर्ज करें';
      isValid = false;
    }

    if (!formData.address?.trim()) {
      tempErrors.address = 'पता आवश्यक है';
      isValid = false;
    }

    if (!documentFile) {
      tempErrors.documents = 'कृपया आवश्यक दस्तावेज़ अपलोड करें';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Create FormData object
    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    // Append document file if exists
    if (documentFile) {
      formDataToSend.append('documents', documentFile);  // Field name is 'documents'

    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(
        API_ENDPOINTS.TAXI_REGISTRATION,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
           
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        toast.success('टैक्सी पंजीकरण सफल हुआ!', {
          position: 'top-center'
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('=== REQUEST ERROR ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || 'पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      
      toast.error(errorMessage, {
        position: 'top-center'
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on type
const getFileIcon = (fileType) => {
  if (fileType === 'application/pdf') {
    return <FaFilePdf className="text-red-500 text-2xl" />;
  }
  if (fileType.startsWith('image/')) {
    return <FaFileImage className="text-blue-500 text-2xl" />;
  }
  return <FaUpload className="text-gray-500 text-2xl" />;
};

return (
  <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <ToastContainer />
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Taxi Registration</h2>
        <p className="text-gray-600">कृपया अपना टैक्सी विवरण भरें</p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          पंजीकरण सफल! आपको डैशबोर्ड पर ले जाया जा रहा है...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          {/* Document Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documents">
              Upload Document (PDF, JPG, PNG) *
            </label>
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {documentFile ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(documentFile.type)}
                      <span className="text-sm text-gray-700">
                        {documentFile.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(documentFile.size)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setDocumentFile(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <FaUpload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="documents"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>फाइल अपलोड करें</span>
                        <input
                          id="documents"
                          name="documents"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">या खींचकर छोड़ें</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG 10MB तक
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Driver Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                errors.driverName ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.driverName && (
              <p className="mt-1 text-sm text-red-600">{errors.driverName}</p>
            )}
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                errors.vehicleNumber ? 'border-red-500' : ''
              }`}
              required
              placeholder="e.g., GJ01AB1234"
            />
            {errors.vehicleNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
            )}
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                errors.vehicleModel ? 'border-red-500' : ''
              }`}
              required
              placeholder="e.g., Swift Dzire"
            />
            {errors.vehicleModel && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleModel}</p>
            )}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                errors.licenseNumber ? 'border-red-500' : ''
              }`}
              required
              placeholder="e.g., GJ0120191234567"
            />
            {errors.licenseNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
            )}
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
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                  errors.phoneNumber ? 'border-red-500' : ''
                }`}
                required
                placeholder="e.g., 9876543210"
                pattern="[0-9]{10}"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">10-digit mobile number</p>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                errors.address ? 'border-red-500' : ''
              }`}
              required
              placeholder="Your complete address"
            ></textarea>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                जमा किया जा रहा है...
              </>
            ) : (
              'टैक्सी पंजीकृत करें'
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default TaxiRegistration;

