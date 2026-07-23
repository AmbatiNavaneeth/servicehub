import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Clock, Heart, Share2, CheckCircle, ChevronDown, ChevronUp,
  Tag, Shield, Award, Users, MapPin,
} from 'lucide-react';
import { services, reviews, categories } from '../data/dummyData';
import StarRating from '../components/ui/StarRating';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { ServiceDetailSkeleton } from '../components/ui/Skeletons';
import EmptyState from '../components/ui/EmptyState';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'included' | 'offers' | 'reviews' | 'faqs'>('included');

  const service = services.find((s) => s.slug === slug);
  const category = service ? categories.find((c) => c.id === service.categoryId) : null;
  const serviceReviews = reviews.filter((r) => r.serviceId === service?.id);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div className="container-app py-6">
        <ServiceDetailSkeleton />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-app py-12">
        <EmptyState
          icon="search"
          title="Service not found"
          description="The service you're looking for doesn't exist or has been removed."
          action={<Link to="/services" className="btn-primary">Browse All Services</Link>}
        />
      </div>
    );
  }

  const wished = isInWishlist(service.id);

  const handleBookNow = () => {
    navigate(`/book/${service.slug}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumbs */}
      <div className="container-app py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            ...(category ? [{ label: category.name, to: `/services?category=${category.slug}` }] : []),
            { label: service.title },
          ]}
        />
      </div>

      <div className="container-app pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-card">
                <img src={service.gallery[activeImage]} alt={service.title} className="w-full h-full object-cover" />
                {service.discount && (
                  <span className="absolute top-4 left-4 badge bg-secondary-500 text-white text-sm px-3 py-1">
                    {service.discount}% OFF
                  </span>
                )}
              </div>
              {service.gallery.length > 1 && (
                <div className="flex gap-3">
                  {service.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-primary-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + Actions */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{service.title}</h1>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 bg-success-50 px-2.5 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-success-500 text-success-500" />
                      <span className="text-sm font-bold text-success-700">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{service.reviewCount.toLocaleString()} reviews</span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" /> {service.duration}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      toggleWishlist(service.id);
                      showToast(wished ? 'info' : 'success', wished ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      wished ? 'border-error-200 bg-error-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wished ? 'fill-error-500 text-error-500' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={() => showToast('info', 'Link copied to clipboard')}
                    className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {[
                  { key: 'included', label: "What's Included" },
                  { key: 'offers', label: 'Offers' },
                  { key: 'reviews', label: `Reviews (${serviceReviews.length})` },
                  { key: 'faqs', label: 'FAQs' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="min-h-[200px]">
              {activeTab === 'included' && (
                <div className="animate-fade-in space-y-4">
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.whatsIncluded.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-success-500 shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="animate-fade-in space-y-3">
                  {service.offers.map((offer, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-50 to-orange-50 rounded-xl border border-secondary-100">
                      <div className="w-10 h-10 rounded-lg bg-secondary-500 flex items-center justify-center shrink-0">
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{offer}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="animate-fade-in space-y-4">
                  {serviceReviews.length === 0 ? (
                    <EmptyState icon="inbox" title="No reviews yet" description="Be the first to review this service after booking." />
                  ) : (
                    serviceReviews.map((review) => (
                      <div key={review.id} className="card p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {review.userName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{review.userName}</div>
                                <div className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                              </div>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="animate-fade-in space-y-3">
                  {service.faqs.map((faq, i) => (
                    <div key={i} className="card overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex items-center justify-between w-full p-4 text-left"
                      >
                        <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
                        {openFaq === i ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="card p-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">Rs {service.price}</span>
                  {service.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">Rs {service.originalPrice}</span>
                  )}
                </div>
                {service.discount && (
                  <div className="badge bg-secondary-50 text-secondary-700 mb-4">
                    Save {service.discount}% ({service.reviewCount > 0 ? 'Inclusive of all taxes' : ''})
                  </div>
                )}

                <div className="space-y-3 mb-5 py-4 border-y border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Duration: <span className="font-semibold text-gray-800">{service.duration}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span><span className="font-semibold text-gray-800">30-day</span> service warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span><span className="font-semibold text-gray-800">Verified</span> professionals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Available in your area</span>
                  </div>
                </div>

                <button onClick={handleBookNow} className="btn-primary w-full py-3.5 text-base">
                  Book Now
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(service.id);
                    showToast(wished ? 'info' : 'success', wished ? 'Removed from wishlist' : 'Added to wishlist');
                  }}
                  className="btn-secondary w-full py-3 mt-2"
                >
                  <Heart className={`w-4 h-4 ${wished ? 'fill-error-500 text-error-500' : ''}`} />
                  {wished ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{service.reviewCount.toLocaleString()}+ booked</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{service.rating} rating</span>
                  </div>
                </div>
              </div>

              {/* Trust card */}
              <div className="card p-5 bg-gradient-to-br from-primary-50 to-white">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Why choose Service Hub?</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: Shield, text: 'Background-verified professionals' },
                    { icon: Award, text: 'Service warranty on all bookings' },
                    { icon: Clock, text: 'On-time arrival, guaranteed' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <item.icon className="w-4 h-4 text-primary-600 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
