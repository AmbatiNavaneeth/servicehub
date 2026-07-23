export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  color: string;
}

export interface Service {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  image: string;
  gallery: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  duration: string;
  whatsIncluded: string[];
  offers: string[];
  faqs: { question: string; answer: string }[];
  popular: boolean;
  trending: boolean;
  featured: boolean;
  locations: string[];
}

export interface Review {
  id: string;
  serviceId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  bookingId?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  servicePrice: number;
  date: string;
  timeSlot: string;
  address: string;
  contactNumber: string;
  instructions?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  reviewed?: boolean;
  couponCode?: string;
  discountAmount?: number;
  finalPrice?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
}

export interface Notification {
  id: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'reminder' | 'offer';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}
