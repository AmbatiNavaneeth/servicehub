import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Phone, MessageSquare, CheckCircle,
  ChevronLeft, ChevronRight, User, Home as HomeIcon, Tag, X,
} from 'lucide-react';
import { services, timeSlots } from '../data/dummyData';
import type { Coupon } from '../types';
import { couponApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';

type Step = 1 | 2 | 3 | 4;

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addBooking } = useBookings();
  const { showToast } = useToast();

  const service = services.find((s) => s.slug === slug);

  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.mobile || '');
  const [instructions, setInstructions] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(user?.addresses[0]?.id || '');
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);

  const basePrice = service?.price ?? 0;
  const discountAmount = appliedCoupon
    ? Math.min(
        appliedCoupon.type === 'percentage'
          ? Math.round((basePrice * appliedCoupon.value) / 100)
          : appliedCoupon.value,
        appliedCoupon.maxDiscount ?? Infinity
      )
    : 0;
  const finalPrice = Math.max(basePrice - discountAmount, 0);

  useEffect(() => {
    couponApi.getCoupons()
      .then((data) => setAvailableCoupons(data as Coupon[]))
      .catch(() => setAvailableCoupons([]));
  }, []);

  const handleApplyCoupon = async () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponLoading(true);
    try {
      const res = await couponApi.validateCoupon(code, basePrice) as {
        coupon: Coupon;
        discount_amount: string;
        final_price: string;
      };
      setAppliedCoupon(res.coupon);
      showToast('success', `Coupon ${res.coupon.code} applied! You save Rs ${res.discount_amount}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setCouponError(e.message || 'Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (!service) {
    return (
      <div className="container-app py-12">
        <EmptyState
          icon="search"
          title="Service not found"
          action={<Link to="/services" className="btn-primary">Browse Services</Link>}
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showToast('info', 'Please login to book a service');
      navigate('/login');
    }
  }, [isAuthenticated]);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const validateStep = (currentStep: Step) => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!selectedDate) errs.date = 'Please select a date';
      if (!selectedSlot) errs.slot = 'Please select a time slot';
    }
    if (currentStep === 2) {
      if (!selectedAddressId && !address) errs.address = 'Please select or enter an address';
    }
    if (currentStep === 3) {
      if (!contactNumber) errs.contact = 'Contact number is required';
      else if (!/^[0-9+\-\s]{10,}$/.test(contactNumber.replace(/\s/g, '')))
        errs.contact = 'Enter a valid contact number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleConfirm = () => {
    const addr = user?.addresses.find((a) => a.id === selectedAddressId);
    const finalAddress = addr
      ? `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city} - ${addr.pincode}`
      : address;

    const booking = addBooking({
      serviceId: service.id,
      serviceTitle: service.title,
      serviceImage: service.image,
      servicePrice: service.price,
      date: selectedDate,
      timeSlot: selectedSlot,
      address: finalAddress,
      contactNumber,
      instructions,
      couponCode: appliedCoupon?.code,
      discountAmount,
      finalPrice,
    });

    setConfirmedBooking({ id: booking.id });
    setStep(4);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const steps = [
    { num: 1, label: 'Date & Time', icon: Calendar },
    { num: 2, label: 'Address', icon: MapPin },
    { num: 3, label: 'Details', icon: User },
    { num: 4, label: 'Confirm', icon: CheckCircle },
  ];

  // Success screen
  if (step === 4 && confirmedBooking) {
    return (
      <div className="container-app py-12 animate-fade-in">
        <div className="max-w-lg mx-auto">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-5 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-success-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your service has been booked successfully. You'll receive a confirmation shortly.
            </p>

            <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-left mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Booking ID</span>
                <span className="font-bold text-primary-600">{confirmedBooking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Service</span>
                <span className="font-semibold text-gray-800 text-sm">{service.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-semibold text-gray-800 text-sm">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Time</span>
                <span className="font-semibold text-gray-800 text-sm">{selectedSlot}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-500">Base Amount</span>
                <span className="font-semibold text-gray-700">Rs {basePrice}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-success-600">Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold text-success-600">- Rs {discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Total Paid</span>
                <span className="text-lg font-bold text-primary-600">Rs {finalPrice}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/bookings" className="btn-primary flex-1 py-3">
                View My Bookings
              </Link>
              <Link to="/services" className="btn-secondary flex-1 py-3">
                Book Another Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="container-app py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: service.title, to: `/service/${service.slug}` },
            { label: 'Book' },
          ]}
        />
      </div>

      <div className="container-app pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Service summary */}
          <div className="card p-4 flex items-center gap-4 mb-6">
            <img src={service.image} alt={service.title} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 truncate">{service.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{service.duration}</span>
                <span className="font-bold text-gray-900">Rs {service.price}</span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= s.num
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > s.num ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step >= s.num ? 'text-primary-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="card p-6">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" /> Select Date
                  </h3>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {dates.map((d, i) => {
                      const dateStr = d.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`shrink-0 w-16 py-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="text-xs font-medium">
                            {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-bold">{d.getDate()}</div>
                          <div className="text-xs">{d.toLocaleDateString('en-IN', { month: 'short' })}</div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.date && <p className="text-xs text-error-500 mt-2">{errors.date}</p>}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" /> Select Time Slot
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all ${
                          selectedSlot === slot
                            ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.slot && <p className="text-xs text-error-500 mt-2">{errors.slot}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" /> Select Address
                </h3>
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {user.addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <HomeIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm">{addr.label}</span>
                              <span className="badge bg-gray-100 text-gray-600">{addr.type}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Or enter a new address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address..."
                    rows={3}
                    className={`input-field resize-none ${errors.address ? 'border-error-400' : ''}`}
                  />
                  {errors.address && <p className="text-xs text-error-500 mt-1">{errors.address}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" /> Contact Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="9876543210"
                      className={`input-field pl-11 ${errors.contact ? 'border-error-400' : ''}`}
                    />
                  </div>
                  {errors.contact && <p className="text-xs text-error-500 mt-1">{errors.contact}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Special Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Any specific requirements or instructions for the professional..."
                      rows={4}
                      className="input-field pl-11 resize-none"
                    />
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary-600" /> Apply Coupon
                  </h4>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-success-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-success-600 text-sm">{appliedCoupon.code}</span>
                          <span className="text-xs text-success-600 bg-success-50 px-2 py-0.5 rounded-full">Applied</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{appliedCoupon.description}</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="p-1.5 hover:bg-error-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-error-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                          placeholder="Enter coupon code"
                          className="input-field flex-1 uppercase"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-error-500 mt-1.5">{couponError}</p>}
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs text-gray-500 font-medium">Available offers:</p>
                        {availableCoupons.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setCouponCode(c.code); setCouponError(''); }}
                            className="block w-full text-left text-xs text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            <span className="font-semibold">{c.code}</span> — {c.description}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Booking Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-800">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-800">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium text-gray-800">{service.title}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Base Price</span>
                    <span className="font-medium text-gray-800">Rs {basePrice}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success-600">Discount ({appliedCoupon?.code})</span>
                      <span className="font-medium text-success-600">- Rs {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-primary-600 text-lg">Rs {finalPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => step > 1 && setStep((step - 1) as Step)}
                  disabled={step === 1}
                  className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < 3 ? (
                  <button onClick={handleNext} className="btn-primary">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleConfirm} className="btn-primary">
                    Confirm Booking <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
