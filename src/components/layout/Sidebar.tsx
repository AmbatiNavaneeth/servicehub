import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon, Wrench, Calendar, Heart, Bell, User, LogOut, X, MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBookings } from '../../context/BookingContext';
import { useLocation as LocationCtx } from '../../context/LocationContext';
import { locations } from '../../data/dummyData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const { wishlist } = useWishlist();
  const { notifications } = useBookings();
  const { selectedLocation, setLocation } = LocationCtx();
  const routerLocation = useLocation();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/services', label: 'All Services', icon: Wrench },
    { to: '/bookings', label: 'My Bookings', icon: Calendar, badge: undefined },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[70] shadow-2xl animate-slide-in-left lg:hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-900">
              Service<span className="text-primary-600">Hub</span>
            </span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User info */}
        {isAuthenticated && user ? (
          <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </Link>
        ) : (
          <div className="px-5 py-4 border-b border-gray-100 flex gap-2">
            <Link to="/login" onClick={onClose} className="btn-secondary flex-1 text-sm">
              Login
            </Link>
            <Link to="/signup" onClick={onClose} className="btn-primary flex-1 text-sm">
              Sign Up
            </Link>
          </div>
        )}

        {/* Location selector */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase">Select Location</span>
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}, {loc.city}
              </option>
            ))}
          </select>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = routerLocation.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600 bg-primary-50 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold bg-error-500 text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        {isAuthenticated && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-error-600 hover:bg-error-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
