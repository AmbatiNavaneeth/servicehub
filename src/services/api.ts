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

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) => apiClient.post('/auth/login/', { email, password }),
  signup: (name: string, email: string, mobile: string, password: string) =>
    apiClient.post('/auth/signup/', { name, email, mobile, password }),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password/', { email }),
  logout: () => apiClient.post('/auth/logout/'),
  getProfile: () => apiClient.get('/auth/profile/'),
  updateProfile: (data: unknown) => apiClient.put('/auth/profile/', data),
};

// Service endpoints
export const serviceApi = {
  getCategories: () => apiClient.get('/services/categories/'),
  getServices: (params?: Record<string, string>) =>
    apiClient.get(`/services/${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  getService: (slug: string) => apiClient.get(`/services/${slug}/`),
  searchServices: (query: string) => apiClient.get(`/services/search/?q=${query}`),
};

// Coupon endpoints
export const couponApi = {
  getCoupons: () => apiClient.get('/coupons/'),
  validateCoupon: (code: string, orderAmount: number) =>
    apiClient.post('/coupons/validate/', { code, order_amount: orderAmount }),
};

// Booking endpoints
export const bookingApi = {
  getBookings: () => apiClient.get('/bookings/'),
  createBooking: (data: unknown) => apiClient.post('/bookings/', data),
  cancelBooking: (id: string) => apiClient.delete(`/bookings/${id}/`),
  getBookingDetails: (id: string) => apiClient.get(`/bookings/${id}/`),
};

// Review endpoints
export const reviewApi = {
  getReviews: (serviceId: string) => apiClient.get(`/services/${serviceId}/reviews/`),
  createReview: (data: unknown) => apiClient.post('/reviews/', data),
};

// Profile endpoints
export const profileApi = {
  getAddresses: () => apiClient.get('/profile/addresses/'),
  addAddress: (data: unknown) => apiClient.post('/profile/addresses/', data),
  updateAddress: (id: string, data: unknown) => apiClient.put(`/profile/addresses/${id}/`, data),
  deleteAddress: (id: string) => apiClient.delete(`/profile/addresses/${id}/`),
};
