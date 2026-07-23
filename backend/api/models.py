from django.db import models


class Service(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    image = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.title


class Coupon(models.Model):
    CODE_TYPES = [
        ('percentage', 'Percentage'),
        ('flat', 'Flat'),
    ]

    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=20, choices=CODE_TYPES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.CharField(max_length=300)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.code


class Booking(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_CHOICES = [
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('refunded', 'Refunded'),
    ]

    booking_id = models.CharField(max_length=20, unique=True)
    service_id = models.CharField(max_length=100)
    service_title = models.CharField(max_length=200)
    service_image = models.URLField()
    service_price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.CharField(max_length=50)
    time_slot = models.CharField(max_length=100)
    address = models.TextField()
    contact_number = models.CharField(max_length=20)
    instructions = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='pending')
    coupon_code = models.CharField(max_length=50, blank=True, default='')
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_id} - {self.service_title}"
