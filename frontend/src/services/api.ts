const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: errorData.error || errorData.detail || 'Request failed',
      data: errorData,
    };
  }

  return res.json();
}

export const apiClient = {
  get: <T>(endpoint: string): Promise<T> => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown): Promise<T> =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown): Promise<T> =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'DELETE' }),
};

export const couponApi = {
  getCoupons: () => apiClient.get('/coupons/'),
  validateCoupon: (code: string, orderAmount: number) =>
    apiClient.post('/coupons/validate/', { code, order_amount: orderAmount }),
};

export const bookingApi = {
  getBookings: () => apiClient.get('/bookings/'),
  createBooking: (data: unknown) => apiClient.post('/bookings/', data),
  cancelBooking: (id: string) => apiClient.delete(`/bookings/${id}/`),
  getBookingDetails: (id: string) => apiClient.get(`/bookings/${id}/`),
};
