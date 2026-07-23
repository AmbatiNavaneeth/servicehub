import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { services } from '../data/dummyData';
import ServiceCard from '../components/ui/ServiceCard';
import EmptyState from '../components/ui/EmptyState';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wishedServices = services.filter((s) => wishlist.includes(s.id));

  return (
    <div className="animate-fade-in">
      <div className="container-app py-4">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      </div>

      <div className="container-app pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-error-500 fill-error-500" />
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          {wishedServices.length > 0 && (
            <span className="badge bg-error-50 text-error-700 ml-2">{wishedServices.length}</span>
          )}
        </div>

        {wishedServices.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="Your wishlist is empty"
            description="Save services you love by tapping the heart icon. They'll appear here for quick access."
            action={
              <Link to="/services" className="btn-primary">
                Browse Services <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
