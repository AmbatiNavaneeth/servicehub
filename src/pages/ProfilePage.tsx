import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, Heart, Bell, Edit2, Plus,
  Trash2, Home as HomeIcon, Briefcase, LogOut, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import type { Address } from '../types';

export default function ProfilePage() {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, logout } = useAuth();
  const { bookings } = useBookings();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return (
      <div className="container-app py-12">
        <EmptyState
          icon="inbox"
          title="Please login to view your profile"
          action={<Link to="/login" className="btn-primary">Login</Link>}
        />
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({ name, email, mobile });
    setEditing(false);
    showToast('success', 'Profile updated successfully!');
  };

  const handleSaveAddress = (addr: Omit<Address, 'id'>) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addr);
      showToast('success', 'Address updated successfully!');
    } else {
      addAddress(addr);
      showToast('success', 'Address added successfully!');
    }
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
    showToast('info', 'Address removed.');
  };

  const handleLogout = () => {
    logout();
    showToast('info', 'Logged out successfully.');
    navigate('/');
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-primary-600 bg-primary-50' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, icon: CheckCircle, color: 'text-success-600 bg-success-50' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'text-error-600 bg-error-50' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="container-app py-4">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Profile' }]} />
      </div>

      <div className="container-app pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile card */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.mobile}</p>

              <div className="grid grid-cols-3 gap-2 mt-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-1.5`}>
                      <stat.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="btn-danger w-full mt-6 py-2.5"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            {/* Quick links */}
            <div className="card p-2 mt-4">
              {[
                { to: '/bookings', label: 'My Bookings', icon: Calendar },
                { to: '/wishlist', label: 'My Wishlist', icon: Heart },
                { to: '/notifications', label: 'Notifications', icon: Bell },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 flex-1">{link.label}</span>
                  <span className="text-gray-300">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="input-field pl-11" />
                    </div>
                  </div>
                  <button onClick={handleSaveProfile} className="btn-primary w-full py-3">
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">Name</div>
                      <div className="text-sm font-medium text-gray-800">{user.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">Email</div>
                      <div className="text-sm font-medium text-gray-800">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">Mobile</div>
                      <div className="text-sm font-medium text-gray-800">{user.mobile}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Addresses */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Saved Addresses</h3>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              {user.addresses.length === 0 ? (
                <EmptyState icon="inbox" title="No saved addresses" description="Add an address to speed up your booking process." />
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                        {addr.type === 'Work' ? <Briefcase className="w-5 h-5 text-primary-600" /> : <HomeIcon className="w-5 h-5 text-primary-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{addr.label}</span>
                          <span className="badge bg-gray-200 text-gray-600">{addr.type}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city} - {addr.pincode}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingAddress(addr);
                            setShowAddressModal(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 rounded-lg hover:bg-error-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-error-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
          existing={editingAddress}
        />
      )}
    </div>
  );
}

function AddressModal({
  isOpen,
  onClose,
  onSave,
  existing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addr: Omit<Address, 'id'>) => void;
  existing: Address | null;
}) {
  const [label, setLabel] = useState(existing?.label || '');
  const [line1, setLine1] = useState(existing?.line1 || '');
  const [line2, setLine2] = useState(existing?.line2 || '');
  const [city, setCity] = useState(existing?.city || '');
  const [pincode, setPincode] = useState(existing?.pincode || '');
  const [type, setType] = useState<Address['type']>(existing?.type || 'Home');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!label.trim()) errs.label = 'Label is required';
    if (!line1.trim()) errs.line1 = 'Address line is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!pincode.trim()) errs.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({ label, line1, line2, city, pincode, type });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existing ? 'Edit Address' : 'Add New Address'} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Home, Office"
            className={`input-field ${errors.label ? 'border-error-400' : ''}`}
          />
          {errors.label && <p className="text-xs text-error-500 mt-1">{errors.label}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
          <input
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="Flat / House No, Building"
            className={`input-field ${errors.line1 ? 'border-error-400' : ''}`}
          />
          {errors.line1 && <p className="text-xs text-error-500 mt-1">{errors.line1}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Street, Area"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai"
              className={`input-field ${errors.city ? 'border-error-400' : ''}`}
            />
            {errors.city && <p className="text-xs text-error-500 mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="400001"
              maxLength={6}
              className={`input-field ${errors.pincode ? 'border-error-400' : ''}`}
            />
            {errors.pincode && <p className="text-xs text-error-500 mt-1">{errors.pincode}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Type</label>
          <div className="flex gap-2">
            {(['Home', 'Work', 'Other'] as Address['type'][]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl border-2 transition-all ${
                  type === t ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1 py-2.5">
            {existing ? 'Update' : 'Add'} Address
          </button>
        </div>
      </div>
    </Modal>
  );
}
