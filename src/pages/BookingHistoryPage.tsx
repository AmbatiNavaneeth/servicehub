import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle,
  RefreshCw, ChevronRight, Star,
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { services } from '../data/dummyData';
import EmptyState from '../components/ui/EmptyState';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Modal from '../components/ui/Modal';
import StarRating from '../components/ui/StarRating';
import type { Booking } from '../types';

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function BookingHistoryPage() {
  const { bookings, cancelBooking, addReviewToBooking } = useBookings();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = bookings.filter((b) => b.status === activeTab);

  const handleCancel = () => {
    if (cancelTarget) {
      cancelBooking(cancelTarget.id);
      showToast('success', 'Booking cancelled successfully.');
      setCancelTarget(null);
    }
  };

  const handleReviewSubmit = () => {
    if (reviewTarget) {
      addReviewToBooking(reviewTarget.id);
      showToast('success', 'Review submitted successfully!');
      setReviewTarget(null);
      setReviewRating(5);
      setReviewComment('');
    }
  };

  const handleBookAgain = (booking: Booking) => {
    const service = services.find((s) => s.id === booking.serviceId);
    if (service) navigate(`/book/${service.slug}`);
  };

  const statusConfig = {
    upcoming: { label: 'Upcoming', color: 'bg-primary-50 text-primary-700', icon: Calendar },
    completed: { label: 'Completed', color: 'bg-success-50 text-success-700', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-error-50 text-error-700', icon: XCircle },
  };

  const paymentConfig = {
    paid: { label: 'Paid', color: 'text-success-600' },
    pending: { label: 'Pending', color: 'text-warning-600' },
    refunded: { label: 'Refunded', color: 'text-gray-500' },
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="animate-fade-in">
      <div className="container-app py-4">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Bookings' }]} />
      </div>

      <div className="container-app pb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-md">
          {(['upcoming', 'completed', 'cancelled'] as Tab[]).map((tab) => {
            const count = bookings.filter((b) => b.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {statusConfig[tab].label} ({count})
              </button>
            );
          })}
        </div>

        {/* Bookings */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="inbox"
            title={`No ${activeTab} bookings`}
            description={
              activeTab === 'upcoming'
                ? "You don't have any upcoming bookings. Browse our services and book one now!"
                : `You don't have any ${activeTab} bookings yet.`
            }
            action={
              activeTab === 'upcoming' ? (
                <Link to="/services" className="btn-primary">Browse Services</Link>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const StatusIcon = statusConfig[booking.status].icon;
              return (
                <div key={booking.id} className="card p-5 hover:shadow-card-hover transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="w-full sm:w-28 h-28 rounded-xl object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{booking.serviceTitle}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Booking ID: {booking.id}</p>
                        </div>
                        <span className={`badge ${statusConfig[booking.status].color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig[booking.status].label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-lg font-bold text-gray-900">Rs {booking.servicePrice}</span>
                          <span className={`ml-3 text-sm font-semibold ${paymentConfig[booking.paymentStatus].color}`}>
                            {paymentConfig[booking.paymentStatus].label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {booking.status === 'upcoming' && (
                            <>
                              <button
                                onClick={() => setCancelTarget(booking)}
                                className="btn-danger text-sm py-2"
                              >
                                Cancel
                              </button>
                              <Link to="/bookings" className="btn-secondary text-sm py-2 hidden sm:flex">
                                <ChevronRight className="w-4 h-4" /> Details
                              </Link>
                            </>
                          )}
                          {booking.status === 'completed' && (
                            <>
                              {!booking.reviewed ? (
                                <button
                                  onClick={() => setReviewTarget(booking)}
                                  className="btn-secondary text-sm py-2"
                                >
                                  <Star className="w-4 h-4" /> Rate & Review
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-success-500" /> Reviewed
                                </span>
                              )}
                              <button
                                onClick={() => handleBookAgain(booking)}
                                className="btn-primary text-sm py-2"
                              >
                                <RefreshCw className="w-4 h-4" /> Book Again
                              </button>
                            </>
                          )}
                          {booking.status === 'cancelled' && (
                            <button
                              onClick={() => handleBookAgain(booking)}
                              className="btn-primary text-sm py-2"
                            >
                              <RefreshCw className="w-4 h-4" /> Book Again
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel Booking?"
        size="sm"
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-error-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-error-500" />
          </div>
          <p className="text-gray-600 text-sm mb-1">
            Are you sure you want to cancel your booking for
          </p>
          <p className="font-semibold text-gray-900">{cancelTarget?.serviceTitle}</p>
          <p className="text-sm text-gray-500 mt-1">
            on {cancelTarget && formatDate(cancelTarget.date)} at {cancelTarget?.timeSlot}?
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Refund will be processed in 5-7 business days.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setCancelTarget(null)} className="btn-ghost flex-1 py-2.5">
            Keep Booking
          </button>
          <button onClick={handleCancel} className="btn bg-error-500 text-white hover:bg-error-600 flex-1 py-2.5 rounded-xl font-semibold transition-all">
            Yes, Cancel
          </button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        title="Rate & Review"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <img src={reviewTarget?.serviceImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <div className="font-semibold text-gray-900 text-sm">{reviewTarget?.serviceTitle}</div>
              <div className="text-xs text-gray-400">{reviewTarget && formatDate(reviewTarget.date)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              <StarRating
                rating={reviewRating}
                size="lg"
                interactive
                onChange={setReviewRating}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this service..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setReviewTarget(null)} className="btn-ghost flex-1 py-2.5">
              Cancel
            </button>
            <button onClick={handleReviewSubmit} className="btn-primary flex-1 py-2.5">
              Submit Review
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
