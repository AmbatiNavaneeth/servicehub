import { Link } from 'react-router-dom';
import { Heart, Clock, Star } from 'lucide-react';
import type { Service } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(service.id);

  return (
    <div className="card-hover overflow-hidden group flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Link to={`/service/${service.slug}`}>
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {service.discount && (
          <span className="absolute top-3 left-3 badge bg-secondary-500 text-white">
            {service.discount}% OFF
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(service.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              wished ? 'fill-error-500 text-error-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/service/${service.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {service.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{service.shortDescription}</p>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-success-50 px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-success-500 text-success-500" />
            <span className="text-xs font-bold text-success-700">{service.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({service.reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{service.duration}</span>
        </div>

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900">Rs {service.price}</span>
              {service.originalPrice && (
                <span className="text-sm text-gray-400 line-through">Rs {service.originalPrice}</span>
              )}
            </div>
          </div>
          <Link to={`/service/${service.slug}`} className="btn-primary text-sm px-4 py-2">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
