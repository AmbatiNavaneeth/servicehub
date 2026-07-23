import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';
import { services, categories } from '../data/dummyData';
import ServiceCard from '../components/ui/ServiceCard';
import { ServiceCardGridSkeleton } from '../components/ui/Skeletons';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import Breadcrumbs from '../components/ui/Breadcrumbs';

type SortOption = 'popular' | 'price_low' | 'price_high' | 'rating';

export default function ServiceListingPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [search, setSearch] = useState(searchQuery);

  const itemsPerPage = 8;

  useEffect(() => {
    setSelectedCategory(categorySlug);
    setSearch(searchQuery);
    setCurrentPage(1);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [categorySlug, searchQuery]);

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) result = result.filter((s) => s.categoryId === cat.id);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    result = result.filter(
      (s) => s.price >= priceRange[0] && s.price <= priceRange[1]
    );

    if (minRating > 0) {
      result = result.filter((s) => s.rating >= minRating);
    }

    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => Number(b.popular) - Number(a.popular));
    }

    return result;
  }, [selectedCategory, search, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentCat = categories.find((c) => c.slug === selectedCategory);

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSelectedCategory('');
    setSearch('');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="container-app py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            ...(currentCat ? [{ label: currentCat.name }] : []),
          ]}
        />
      </div>

      <div className="container-app pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterPanel
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                resetFilters={resetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentCat ? currentCat.name : 'All Services'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn-secondary py-2.5 relative"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold bg-primary-600 text-white rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Services grid */}
            {loading ? (
              <ServiceCardGridSkeleton count={8} />
            ) : paginatedServices.length === 0 ? (
              <EmptyState
                icon="search"
                title="No services found"
                description="Try adjusting your filters or search query to find what you're looking for."
                action={
                  <button onClick={resetFilters} className="btn-primary">
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-5">
              <FilterPanel
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                resetFilters={resetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
            <div className="p-5 sticky bottom-0 bg-white border-t border-gray-100">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full py-3">
                Show {filteredServices.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  selectedCategory,
  setSelectedCategory,
  resetFilters,
  activeFilterCount,
}: {
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-xs font-semibold text-primary-600 hover:text-primary-700">
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
              !selectedCategory ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === cat.slug ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400">Min</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
          </div>
          <span className="text-gray-400 mt-4">-</span>
          <div className="flex-1">
            <label className="text-xs text-gray-400">Max</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Rs {priceRange[0]}</span>
          <span>Rs {priceRange[1]}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[0, 4, 4.5, 4.7].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                minRating === rating ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {rating === 0 ? (
                'All Ratings'
              ) : (
                <>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{rating} & above</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
