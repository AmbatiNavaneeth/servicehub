from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Coupon, Booking
from .serializers import CouponSerializer, ValidateCouponSerializer, BookingSerializer


class CouponListView(APIView):
    def get(self, request):
        coupons = Coupon.objects.filter(active=True)
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)


class ValidateCouponView(APIView):
    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request data'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        code = serializer.validated_data['code'].upper().strip()
        order_amount = serializer.validated_data['order_amount']

        try:
            coupon = Coupon.objects.get(code=code, active=True)
        except Coupon.DoesNotExist:
            return Response(
                {'error': 'Invalid coupon code'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if Decimal(order_amount) < coupon.min_order:
            return Response(
                {'error': f'Minimum order Rs {coupon.min_order} required for this coupon'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if coupon.type == 'percentage':
            discount = (Decimal(order_amount) * coupon.value) / Decimal(100)
            if coupon.max_discount is not None:
                discount = min(discount, coupon.max_discount)
        else:
            discount = coupon.value

        discount = min(discount, Decimal(order_amount))
        final_price = Decimal(order_amount) - discount

        return Response({
            'coupon': CouponSerializer(coupon).data,
            'discount_amount': str(discount),
            'final_price': str(final_price),
        })


class BookingListCreateView(APIView):
    def get(self, request):
        bookings = Booking.objects.all().order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingDetailView(APIView):
    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(booking_id=booking_id)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    def delete(self, request, booking_id):
        try:
            booking = Booking.objects.get(booking_id=booking_id)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        booking.status = 'cancelled'
        booking.payment_status = 'refunded'
        booking.save()
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
