export function ServiceCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex items-center gap-2 pt-2">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ServiceCardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="skeleton w-20 h-20 rounded-2xl" />
      <div className="skeleton h-4 w-16" />
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-80 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-40 w-full rounded-xl" />
        </div>
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
