export interface Coupon {
  id?: number;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  min_order: number;
  max_discount: number | null;
  description: string;
  active: boolean;
}

export interface Booking {
  booking_id: string;
  service_id: string;
  service_title: string;
  service_image: string;
  service_price: number;
  date: string;
  time_slot: string;
  address: string;
  contact_number: string;
  instructions?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'refunded';
  coupon_code?: string;
  discount_amount?: number;
  final_price?: number;
  created_at?: string;
}

export interface ValidateCouponResponse {
  coupon: Coupon;
  discount_amount: string;
  final_price: string;
}
