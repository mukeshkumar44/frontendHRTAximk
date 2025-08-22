import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './components/Home';
import TourPackages from './components/TourPackages';
import CustomerReviews from './components/CustomerReviews';
import Gallery from './components/Gallery';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Services from './components/Services';
import Destinations from './components/Destinations';
import Login from './components/Login';
import Signup from './components/Signup';
import OtpVerification from './components/OtpVerification';
import Profile from './components/Profile';
import MyBookings from './components/MyBookings';
import TaxiRegistration from './components/TaxiRegistration';
import TaxiStatus from './components/TaxiStatus';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedDriverRoute from './components/auth/ProtectedDriverRoute';
import DriverDashboard from './components/driver/DriverDashboard';
import UserDashboard from './components/user/UserDashboard';

// Import Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBookings from './components/admin/AdminBookings';
import AdminTaxis from './components/admin/AdminTaxis';
import AdminTourPackages from './components/AdminTourPackages';
import AdminGallery from './components/admin/AdminGallery';
import AuthRedirect from './components/AuthRedirect';

// Protected Route Component
const ProtectedRouteComponent = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="pt-20"> 
            <Routes>
              <Route path="/" element={
                <>
                  <Home />
                  <TourPackages />
                  <CustomerReviews />
                  <Gallery />
                </>
              } />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<BookingForm/>} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/auth-redirect" element={<AuthRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/register-taxi" element={<TaxiRegistration />} />
              <Route path="/taxi-status" element={<TaxiStatus />} />
              
              {/* Protected User Routes */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRouteComponent>
                    <UserDashboard />
                  </ProtectedRouteComponent>
                }
              />
              
              {/* Protected Driver Routes */}
              <Route element={<ProtectedDriverRoute />}>
                <Route path="/driver/dashboard" element={<DriverDashboard />} />
              </Route>
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute isAdmin={true} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/taxis" element={<AdminTaxis />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/tour-packages" element={<AdminTourPackages />} />
              </Route>
              
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                </div>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;