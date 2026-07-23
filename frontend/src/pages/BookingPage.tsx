import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, MessageSquare, CircleCheck as CheckCircle, Tag, X, ChevronRight } from 'lucide-react';
import type { Coupon, ValidateCouponResponse } from '../types';
import { couponApi, bookingApi } from '../services/api';

const SERVICE = {
  id: 'plumber',
  title: 'Professional Plumbing Service',
  image: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg',
  price: 399,
};

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
];

type Step = 1 | 2 | 3 | 4;

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedId, setConfirmedId] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  const basePrice = SERVICE.price;
  const discountAmount = appliedCoupon
    ? Math.min(
        appliedCoupon.type === 'percentage'
          ? Math.round((basePrice * Number(appliedCoupon.value)) / 100)
          : Number(appliedCoupon.value),
        appliedCoupon.max_discount ? Number(appliedCoupon.max_discount) : Infinity,
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
      const res = await couponApi.validateCoupon(code, basePrice) as ValidateCouponResponse;
      setAppliedCoupon(res.coupon);
      setCouponError('');
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

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!selectedDate) e.date = 'Please select a date';
    if (!selectedSlot) e.slot = 'Please select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!address.trim()) e.address = 'Please enter your address';
    if (!contactNumber.trim()) e.contact = 'Please enter your contact number';
    else if (!/^\d{10}$/.test(contactNumber.replace(/\D/g, ''))) e.contact = 'Enter a valid 10-digit number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    const bookingId = `BK${String(Date.now()).slice(-6)}`;
    try {
      await bookingApi.createBooking({
        booking_id: bookingId,
        service_id: SERVICE.id,
        service_title: SERVICE.title,
        service_image: SERVICE.image,
        service_price: basePrice,
        date: selectedDate,
        time_slot: selectedSlot,
        address,
        contact_number: contactNumber,
        instructions,
        status: 'upcoming',
        payment_status: 'pending',
        coupon_code: appliedCoupon?.code || '',
        discount_amount: discountAmount,
        final_price: finalPrice,
      });
      setConfirmedId(bookingId);
      setStep(4);
    } catch {
      setErrors({ submit: 'Failed to create booking. Please try again.' });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">Your booking ID is <span className="font-semibold text-gray-900">{confirmedId}</span></p>

          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{SERVICE.title}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSlot}</span></div>
            <div className="flex justify-between pt-2 border-t"><span className="text-gray-500">Base Price</span><span className="font-medium">Rs {basePrice}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between"><span className="text-green-600">Discount ({appliedCoupon?.code})</span><span className="font-medium text-green-600">- Rs {discountAmount}</span></div>
            )}
            <div className="flex justify-between pt-2 border-t"><span className="font-semibold">Total Paid</span><span className="font-bold text-blue-600 text-lg">Rs {finalPrice}</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8 gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> Select Date & Time</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" min={today} value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setErrors({ ...errors, date: '' }); }} className="w-full border rounded-lg px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.date && <p className="text-sm text-red-500 mb-3">{errors.date}</p>}
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button key={slot} onClick={() => { setSelectedSlot(slot); setErrors({ ...errors, slot: '' }); }} className={`border rounded-lg px-3 py-2 text-sm transition ${selectedSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}>
                    {slot}
                  </button>
                ))}
              </div>
              {errors.slot && <p className="text-sm text-red-500 mt-2">{errors.slot}</p>}
              <button onClick={() => validateStep1() && setStep(2)} className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">Continue <ChevronRight className="w-4 h-4" /></button>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> Contact Details</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={address} onChange={(e) => { setAddress(e.target.value); setErrors({ ...errors, address: '' }); }} placeholder="Enter your full address" rows={3} className="w-full border rounded-lg px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.address && <p className="text-sm text-red-500 mb-2">{errors.address}</p>}
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2"><Phone className="w-4 h-4 inline mr-1" /> Contact Number</label>
              <input type="tel" value={contactNumber} onChange={(e) => { setContactNumber(e.target.value); setErrors({ ...errors, contact: '' }); }} placeholder="10-digit mobile number" className="w-full border rounded-lg px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.contact && <p className="text-sm text-red-500 mb-2">{errors.contact}</p>}
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2"><MessageSquare className="w-4 h-4 inline mr-1" /> Special Instructions (Optional)</label>
              <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Any specific requirements..." rows={2} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 border rounded-lg font-medium hover:bg-gray-50 transition">Back</button>
                <button onClick={() => validateStep2() && setStep(3)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">Continue <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Step 3: Coupon & Summary */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Coupon Form */}
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-blue-600" /> Apply Coupon</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600 text-sm">{appliedCoupon.code}</span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Applied</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{appliedCoupon.description}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="p-1.5 hover:bg-red-50 rounded-lg transition"><X className="w-4 h-4 text-red-500" /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }} placeholder="Enter coupon code" className="flex-1 border rounded-lg px-3 py-2 uppercase focus:ring-2 focus:ring-blue-500 outline-none" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())} />
                      <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap">{couponLoading ? '...' : 'Apply'}</button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                    {availableCoupons.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs text-gray-500 font-medium">Available offers:</p>
                        {availableCoupons.map((c) => (
                          <button key={c.code} onClick={() => { setCouponCode(c.code); setCouponError(''); }} className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 transition">
                            <span className="font-semibold">{c.code}</span> — {c.description}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-medium">{SERVICE.title}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSlot}</span></div>
                  <div className="flex justify-between text-sm pt-2 border-t"><span className="text-gray-500">Base Price</span><span className="font-medium">Rs {basePrice}</span></div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm"><span className="text-green-600">Discount ({appliedCoupon?.code})</span><span className="font-medium text-green-600">- Rs {discountAmount}</span></div>
                  )}
                  <div className="flex justify-between pt-2 border-t"><span className="font-semibold">Total Amount</span><span className="font-bold text-blue-600 text-lg">Rs {finalPrice}</span></div>
                </div>
                {errors.submit && <p className="text-sm text-red-500 mt-3">{errors.submit}</p>}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-4 py-2.5 border rounded-lg font-medium hover:bg-gray-50 transition">Back</button>
                  <button onClick={handleConfirm} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">Confirm Booking</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - Service info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow p-5 sticky top-4">
            <img src={SERVICE.image} alt={SERVICE.title} className="w-full h-32 object-cover rounded-xl mb-3" />
            <h3 className="font-bold text-gray-900">{SERVICE.title}</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">Rs {finalPrice}</p>
            {discountAmount > 0 && <p className="text-sm text-gray-400 line-through">Rs {basePrice}</p>}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> 1 hour service</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-400" /> Verified professionals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
