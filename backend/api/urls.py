from django.urls import path
from .views import (
    CouponListView,
    ValidateCouponView,
    BookingListCreateView,
    BookingDetailView,
)

urlpatterns = [
    path('coupons/', CouponListView.as_view(), name='coupon-list'),
    path('coupons/validate/', ValidateCouponView.as_view(), name='validate-coupon'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<str:booking_id>/', BookingDetailView.as_view(), name='booking-detail'),
]
