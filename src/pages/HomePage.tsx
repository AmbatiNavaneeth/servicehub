import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, ArrowRight, Shield, Clock, Users, Award,
  Sparkles, TrendingUp, Tag, ChevronRight, Quote,
} from 'lucide-react';
import { categories, services, testimonials } from '../data/dummyData';
import ServiceCard from '../components/ui/ServiceCard';
import StarRating from '../components/ui/StarRating';
import { useLocation } from '../context/LocationContext';
import { locations } from '../data/dummyData';

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const currentLoc = locations.find((l) => l.id === selectedLocation) || locations[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredServices = services.filter((s) => s.featured).slice(0, 4);
  const trendingServices = services.filter((s) => s.trending).slice(0, 4);
  const popularServices = services.filter((s) => s.popular).slice(0, 8);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="container-app relative py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
              <Sparkles className="w-4 h-4 text-secondary-300" />
              <span className="text-sm text-white/90 font-medium">Premium home services in Hyderabad</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Premium Home Services at Your Doorstep
            </h1>
            <p className="text-lg text-white/80 mt-4 max-w-xl">
              Book trusted professionals for AC repair, plumbing, cleaning, salon, and more. Quality service, guaranteed.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a service..."
                  className="w-full pl-12 pr-4 py-4 text-sm bg-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300/50"
                />
              </div>
              <button type="submit" className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 shadow-lg">
                Search
              </button>
            </form>

            {/* Location */}
            <div className="flex items-center gap-2 mt-5 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Showing services available in</span>
              <span className="font-semibold text-white">{currentLoc.name}, {currentLoc.city}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="container-app -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: 'Verified Pros', desc: 'Background-checked experts' },
            { icon: Clock, title: 'On-Time Service', desc: 'Punctual & reliable' },
            { icon: Award, title: 'Quality Assured', desc: 'Service warranty' },
            { icon: Users, title: 'Growing Fast', desc: 'Join our community' },
          ].map((badge, i) => (
            <div
              key={i}
              className="card p-4 flex items-center gap-3 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <badge.icon className="w-5.5 h-5.5 text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{badge.title}</div>
                <div className="text-xs text-gray-500">{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Explore our wide range of home services</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/services?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm md:text-base text-center px-1">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="container-app py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-6 h-6 fill-secondary-400 text-secondary-400" />
              Featured Services
            </h2>
            <p className="text-sm text-gray-500 mt-1">Our most popular and recommended services</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredServices.map((service, i) => (
            <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </section>

      {/* Offers Banner */}
      <section className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 p-6 md:p-8">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 mb-3">
                <Tag className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white">Limited Time</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Monsoon Sale - 40% OFF</h3>
              <p className="text-white/80 text-sm mb-4">On all pest control and deep cleaning services</p>
              <Link to="/services?category=pest-control" className="inline-flex items-center gap-2 bg-white text-secondary-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-secondary-50 transition-colors">
                Grab Offer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 md:p-8">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white">New Customer</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Flat Rs 200 OFF</h3>
              <p className="text-white/80 text-sm mb-4">On your first booking. Use code: FIRST200</p>
              <Link to="/services" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* Trending Services */}
      <section className="container-app py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-success-500" />
              Trending Now
            </h2>
            <p className="text-sm text-gray-500 mt-1">Services everyone is booking this week</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingServices.map((service, i) => (
            <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="container-app py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Booked Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-12 mt-8">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-sm text-gray-500 mt-2">Real reviews from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div
                key={t.id}
                className="card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-primary-100 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={t.rating} size="sm" />
                      <span className="text-xs text-gray-400">{t.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Book Your Service?</h2>
            <p className="text-gray-300 mb-6">Join millions of happy customers who trust Service Hub for their home service needs.</p>
            <Link to="/services" className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors">
              Explore Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
