import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin, Search, ChevronDown, Menu, Heart, Bell, User, LogOut,
  Calendar, Home as HomeIcon, Wrench, LocateFixed,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation as LocationCtx } from '../../context/LocationContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBookings } from '../../context/BookingContext';
import { locations } from '../../data/dummyData';

export default function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { selectedLocation, setLocation, detectLocation, isDetecting, detectError } = LocationCtx();
  const { wishlist } = useWishlist();
  const { notifications } = useBookings();
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const locDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentLoc = locations.find((l) => l.id === selectedLocation) || locations[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locDropdownRef.current && !locDropdownRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/services', label: 'All Services', icon: Wrench },
    { to: '/bookings', label: 'Bookings', icon: Calendar },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50">
      <div className="container-app">
        <div className="flex items-center gap-3 h-16">
          {/* Mobile menu button */}
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              Service<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          {/* Location selector */}
          <div className="relative shrink-0" ref={locDropdownRef}>
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary-600" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-gray-400 leading-none">Location</div>
                <div className="text-sm font-semibold text-gray-800 leading-tight flex items-center gap-1">
                  {currentLoc.name}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 sm:hidden" />
            </button>

            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-down max-h-80 overflow-y-auto">
                <button
                  onClick={() => detectLocation()}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <LocateFixed className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                  {isDetecting ? 'Detecting...' : 'Detect current location'}
                </button>
                {detectError && (
                  <p className="px-4 py-1.5 text-xs text-error-500">{detectError}</p>
                )}
                <div className="border-t border-gray-100 my-1" />
                <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
                  Select Location
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc.id);
                      setShowLocationDropdown(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                      loc.id === selectedLocation
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{loc.name}</span>
                    <span className="text-xs text-gray-400">{loc.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    routerLocation.pathname === link.to
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[10px] font-bold bg-error-500 text-white rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[10px] font-bold bg-secondary-500 text-white rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-gray-500" />
                      My Bookings
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-gray-500" />
                      Wishlist
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm hidden sm:flex">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search bar - mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for services..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
