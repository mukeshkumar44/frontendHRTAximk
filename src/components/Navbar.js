import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">HRTaxi.com</Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/destinations" className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium">Destinaions</Link>
              <Link to="/services" className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium">Services</Link>
              <Link to="/booking" className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium">Booking</Link>
              {/* <Link to="#" className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium">Contact</Link> */}
            </div>
          </div>

          {/* Auth Buttons or User Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center text-white hover:text-yellow-400 focus:outline-none"
                >
                  <span className="mr-2">{user?.name?.split(' ')[0] || 'User'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>

                    {/* Driver Dashboard Link */}
                    {user && user.role === 'driver' && (
                      <Link 
                        to="/driver/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Driver Dashboard
                      </Link>
                    )}
                    
                    {/* Admin Menu Items */}
                    {user && user.role === 'admin' ? (
                      // एडमिन मेनू आइटम्स
                      <>
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                        <Link 
                          to="/admin/bookings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Manage Bookings
                        </Link>
                        <Link 
                          to="/admin/tour-packages" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Manage Tour Packages
                        </Link>
                        <Link 
                          to="/admin/taxis" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Manage Taxis
                        </Link>
                      </>
                    ) : (
                      // सामान्य यूजर मेनू आइटम्स
                      <>
                        <Link 
                          to="/my-bookings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Bookings
                        </Link>
                        {user.role === 'driver' && (
                          <Link 
                            to="/driver/dashboard" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            Driver Panel
                          </Link>
                        )}
                        {user.role === 'driver' ? (
                          <Link 
                            to="/register-taxi" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            My Taxi
                          </Link>
                        ) : (
                          <Link 
                            to="/register-taxi" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            Register Taxi
                          </Link>
                        )}
                      </>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white hover:text-yellow-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 py-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/destinations" 
              className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              Destinations
            </Link>
            <Link 
              to="/services" 
              className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link 
              to="/booking" 
              className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              Booking
            </Link>
            <Link 
              to="#" 
              className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            
            {/* Auth Links - Mobile */}
            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-800 pt-4 pb-3">
                  <div className="px-3 py-2">
                    <p className="text-white font-medium">{user?.name || 'User'}</p>
                    <p className="text-gray-400 text-sm">{user?.email || ''}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                    onClick={toggleMenu}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/my-bookings" 
                    className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                    onClick={toggleMenu}
                  >
                    My Bookings
                  </Link>
                  {user.role === 'driver' && (
                    <Link 
                      to="/driver/dashboard" 
                      className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                      onClick={toggleMenu}
                    >
                      Driver Panel
                    </Link>
                  )}
                  {user.role === 'driver' ? (
                    <Link 
                      to="/register-taxi" 
                      className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                      onClick={toggleMenu}
                    >
                      My Taxi
                    </Link>
                  ) : (
                    <Link 
                      to="/register-taxi" 
                      className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                      onClick={toggleMenu}
                    >
                      Register Taxi
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-white hover:text-yellow-400 block w-full text-left px-3 py-2 text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-800 pt-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-yellow-500 hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
