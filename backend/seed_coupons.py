import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Coupon

coupons = [
    {
        'code': 'WELCOME50',
        'type': 'flat',
        'value': 50,
        'min_order': 199,
        'max_discount': None,
        'description': 'Rs 50 off on orders above Rs 199',
    },
    {
        'code': 'SAVE10',
        'type': 'percentage',
        'value': 10,
        'min_order': 299,
        'max_discount': 100,
        'description': '10% off up to Rs 100 on orders above Rs 299',
    },
    {
        'code': 'FIRST20',
        'type': 'percentage',
        'value': 20,
        'min_order': 499,
        'max_discount': 150,
        'description': '20% off up to Rs 150 on orders above Rs 499',
    },
    {
        'code': 'HYD100',
        'type': 'flat',
        'value': 100,
        'min_order': 599,
        'max_discount': None,
        'description': 'Rs 100 off on orders above Rs 599',
    },
]

for c in coupons:
    Coupon.objects.update_or_create(
        code=c['code'],
        defaults={
            'type': c['type'],
            'value': c['value'],
            'min_order': c['min_order'],
            'max_discount': c['max_discount'],
            'description': c['description'],
            'active': True,
        },
    )

print(f'Seeded {len(coupons)} coupons')
