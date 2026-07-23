import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Booking, Notification } from '../types';
import { notifications as defaultNotifications } from '../data/dummyData';

interface BookingContextType {
  bookings: Booking[];
  notifications: Notification[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => Booking;
  cancelBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addReviewToBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  useEffect(() => {
    const stored = localStorage.getItem('servicehub_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        localStorage.removeItem('servicehub_bookings');
      }
    }
  }, []);

  const persistBookings = (b: Booking[]) => {
    localStorage.setItem('servicehub_bookings', JSON.stringify(b));
    setBookings(b);
  };

  const addBooking = (data: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const booking: Booking = {
      ...data,
      id: `BK${String(Date.now()).slice(-6)}`,
      status: 'upcoming',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    persistBookings([booking, ...bookings]);

    const notif: Notification = {
      id: `ntf${Date.now()}`,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: `Your ${booking.serviceTitle} booking (${booking.id}) has been confirmed for ${booking.date} at ${booking.timeSlot}.`,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return booking;
  };

  const cancelBooking = (id: string) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: 'cancelled' as const, paymentStatus: 'refunded' as const } : b
    );
    persistBookings(updated);

    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      const notif: Notification = {
        id: `ntf${Date.now()}`,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: `Your ${booking.serviceTitle} booking (${booking.id}) has been cancelled.`,
        date: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const getBooking = (id: string) => bookings.find((b) => b.id === id);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addReviewToBooking = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, reviewed: true } : b
    );
    persistBookings(updated);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        notifications,
        addBooking,
        cancelBooking,
        getBooking,
        markNotificationRead,
        markAllRead,
        addReviewToBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}
