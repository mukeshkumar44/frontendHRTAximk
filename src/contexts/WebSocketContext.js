import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    // Create socket connection
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // Connection established
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Authenticate with the server
      newSocket.emit('authenticate', { 
        token: localStorage.getItem('token'),
        userId: user._id 
      });
    });

    // Handle disconnection
    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      // Attempt to reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectTimeout.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          newSocket.connect();
        }, delay);
      }
    });

    // Handle connection error
    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Handle driver location updates
    newSocket.on('driverLocationUpdated', (data) => {
      setDriverLocation({
        lat: data.location.lat,
        lng: data.location.lng,
        timestamp: new Date(data.timestamp)
      });
    });

    // Handle booking status updates
    newSocket.on('bookingStatusChanged', (data) => {
      setActiveBooking(prev => ({
        ...prev,
        status: data.status,
        driverLocation: data.driverLocation
      }));
      
      // Show notification to user
      if (data.status === 'accepted') {
        toast.success('Your booking has been accepted!');
      } else if (data.status === 'in_progress') {
        toast.info('Your driver is on the way!');
      } else if (data.status === 'completed') {
        toast.success('Ride completed! Thank you for choosing our service.');
      } else if (data.status === 'cancelled') {
        toast.warning('Your booking has been cancelled.');
      }
    });

    // Handle driver status changes
    newSocket.on('driverStatusChanged', (data) => {
      if (data.isOnline) {
        toast.info('You are now online and available for bookings');
      } else {
        toast.warning('You are now offline and will not receive new bookings');
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?._id]);

  // Update driver's location
  const updateDriverLocation = (location) => {
    if (socket && isConnected) {
      socket.emit('locationUpdate', {
        driverId: user._id,
        location: {
          lat: location.lat,
          lng: location.lng
        }
      });
    }
  };

  // Update booking status
  const updateBookingStatus = (bookingId, status, driverLocation = null) => {
    if (socket && isConnected) {
      socket.emit('bookingStatusUpdate', {
        bookingId,
        status,
        driverId: user._id,
        ...(driverLocation && { driverLocation })
      });
    }
  };

  // Toggle driver's online status
  const toggleOnlineStatus = (isOnline) => {
    if (socket && isConnected) {
      socket.emit('driverStatus', { isOnline });
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        driverLocation,
        activeBooking,
        updateDriverLocation,
        updateBookingStatus,
        toggleOnlineStatus
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
