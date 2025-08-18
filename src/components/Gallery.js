import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchImages = async (pageNum = 1) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/gallery?page=${pageNum}&limit=8`);
      if (response.data.success) {
        if (pageNum === 1) {
          setImages(response.data.data);
        } else {
          setImages(prev => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.data.length === 8);
      }
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError('Failed to load gallery images. Please try again later.');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError('');
              setLoading(true);
              fetchImages();
            }}
            className="bg-yellow-500 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our stunning destinations and memorable travel experiences with us.</p>
        </div>
        
        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image._id} className="relative overflow-hidden rounded-lg group h-64">
                  <img 
                    src={image.image} 
                    alt={image.title || 'Gallery Image'}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center p-4">
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">{image.title || 'No Title'}</p>
                      {image.description && (
                        <p className="text-white text-sm mt-2 line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-10">
                <button 
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found in the gallery.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
