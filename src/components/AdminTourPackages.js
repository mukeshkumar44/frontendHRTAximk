import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_ENDPOINTS } from '../config/api';

const AdminTourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formDataState, setFormDataState] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    isPopular: false,
    features: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch all tour packages
  const fetchTourPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching tour packages from:', API_ENDPOINTS.TOUR_PACKAGES);
      
      const response = await axios.get(API_ENDPOINTS.TOUR_PACKAGES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });  
      
      console.log('Tour packages response:', response.data);
      setPackages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tour packages:', error);
      console.error('Error details:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        response: error.response?.data
      });
      toast.error('Failed to load tour packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourPackages();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for adding new package
  const openAddModal = () => {
    setEditingPackage(null);
    setFormDataState({
      title: '',
      description: '',
      price: '',
      duration: '',
      location: '',
      isPopular: false,
      features: ''
    });
    setImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Open modal for editing package
  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormDataState({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      location: pkg.location,
      isPopular: pkg.isPopular,
      features: pkg.features.join(',')
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(formDataState).forEach(key => {
        if (key === 'features' && formDataState[key]) {
          // Convert features string to array
          const featuresArray = formDataState[key].split(',').map(f => f.trim());
          formData.append('features', JSON.stringify(featuresArray));
        } else if (key === 'isPopular') {
          // Convert boolean to string
          formData.append('isPopular', formDataState[key].toString());
        } else if (formDataState[key] !== null && formDataState[key] !== undefined) {
          formData.append(key, formDataState[key]);
        }
      });
      
      // Append the image file if it exists
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      // Debug log the form data
      console.log('Form Data:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const endpoint = editingPackage 
        ? `${API_ENDPOINTS.TOUR_PACKAGES}/${editingPackage._id}`
        : API_ENDPOINTS.TOUR_PACKAGES;

      const method = editingPackage ? 'put' : 'post';
      
      console.log(`Making ${method.toUpperCase()} request to:`, endpoint);
      
      const response = await axios({
        method,
        url: endpoint,
        data: formData,
        headers: config.headers
      });

      console.log('Server response:', response.data);
      
      toast.success(editingPackage ? 'Package updated successfully' : 'Package created successfully');

      // Reset form and close modal
      setFormDataState({
        title: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        isPopular: false,
        features: ''
      });
      setImage(null);
      setImagePreview(null);
      setEditingPackage(null);
      fetchTourPackages();
      setIsModalOpen(false);
      
    } catch (error) {
      console.error('Error saving package:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      const errorMessage = error.response?.data?.message || 'Failed to save package. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (pkg) => {
    setSelectedPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  // Handle delete package
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_ENDPOINTS.TOUR_PACKAGES}/${selectedPackage._id}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      toast.success('Package deleted successfully');
      setIsDeleteModalOpen(false);
      fetchTourPackages();
    } catch (err) {
      console.error('Error deleting package:', err);
      toast.error(err.response?.data?.message || 'Error deleting package');
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Tour Packages</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popular</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      <img
                        src={pkg.image && (pkg.image.startsWith('http') ? pkg.image : `${API_ENDPOINTS.BASE_URL.replace('/api', '')}${pkg.image}`)}
                        alt={pkg.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-tour.jpg';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                    <div className="text-sm text-gray-500">{pkg.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pkg.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(pkg.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.isPopular ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {pkg.isPopular ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(pkg)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formDataState.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formDataState.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formDataState.duration}
                      onChange={handleChange}
                      placeholder="e.g., 5 Days / 4 Nights"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formDataState.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPopular"
                      name="isPopular"
                      checked={formDataState.isPopular}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700">
                      Mark as Popular
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {editingPackage?.image && !image && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Current Image:</p>
                        {editingPackage?.image && (
                          <img
                            src={editingPackage.image && (editingPackage.image.startsWith('http') ? editingPackage.image : `${API_ENDPOINTS.BASE_URL.replace('/api', '')}${editingPackage.image}`)}
                            alt="Current" 
                            className="h-20 w-auto mt-1"
                          />
                        )}
                      </div>
                    )}
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Selected Image:</p>
                        <img
                          src={imagePreview}
                          alt="Selected" 
                          className="h-20 w-auto mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formDataState.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (comma separated)
                  </label>
                  <textarea
                    name="features"
                    value={formDataState.features}
                    onChange={handleChange}
                    rows="2"
                    placeholder="e.g., Hotel, Meals, Sightseeing, Transfers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Delete Package</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedPackage?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTourPackages;
