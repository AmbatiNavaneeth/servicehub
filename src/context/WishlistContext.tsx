import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (serviceId: string) => void;
  isInWishlist: (serviceId: string) => boolean;
  removeFromWishlist: (serviceId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('servicehub_wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        localStorage.removeItem('servicehub_wishlist');
      }
    }
  }, []);

  const persist = (w: string[]) => {
    localStorage.setItem('servicehub_wishlist', JSON.stringify(w));
    setWishlist(w);
  };

  const toggleWishlist = (serviceId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
      localStorage.setItem('servicehub_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (serviceId: string) => wishlist.includes(serviceId);
  const removeFromWishlist = (serviceId: string) =>
    persist(wishlist.filter((id) => id !== serviceId));

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
