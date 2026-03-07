"""
seed.py — Populates the database with 10 sample products and a superuser.
Run with: python seed.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from ecommerce.models import Product


def run():
    print("Seeding database...")

    # ── Superuser ──────────────────────────────────────────────────────────────
    if not User.objects.filter(username='admin@example.com').exists():
        User.objects.create_superuser(
            username='admin@example.com',
            email='admin@example.com',
            password='adminpass',
            first_name='Admin'
        )
        print("  ✓ Superuser created  (admin@example.com / adminpass)")
    else:
        print("  ✓ Superuser already exists")

    admin_user = User.objects.get(username='admin@example.com')

    # ── Products ───────────────────────────────────────────────────────────────
    if Product.objects.count() > 0:
        print("  Products already exist – deleting and re-seeding...")
        Product.objects.all().delete()

    products = [
        {
            "name": "Wireless Bluetooth Earbuds",
            "image": "earbuds.png",
            "brand": "SoundWave",
            "category": "Electronics",
            "description": (
                "True wireless earbuds with active noise cancellation, "
                "30-hour total battery life, and IPX5 water resistance. "
                "Enjoy rich bass and crystal-clear calls."
            ),
            "rating": 4.5,
            "numReviews": 128,
            "price": 8.99,          # Razorpay requires <10 INR for test
            "countInStock": 25,
        },
        {
            "name": "Pro AMOLED Smartphone",
            "image": "smartphone.png",
            "brand": "NovaTech",
            "category": "Electronics",
            "description": (
                "6.7\" AMOLED display, 108 MP camera, 5000 mAh battery with "
                "65W fast charge. Runs the latest Android with 8 GB RAM."
            ),
            "rating": 4.7,
            "numReviews": 214,
            "price": 9.49,
            "countInStock": 18,
        },
        {
            "name": "RGB Gaming Laptop",
            "image": "laptop.png",
            "brand": "BladeEdge",
            "category": "Computers",
            "description": (
                "15.6\" FHD 144 Hz display, Intel Core i7, 16 GB DDR5 RAM, "
                "RTX 4060 GPU, 1 TB NVMe SSD. Built for high-performance gaming."
            ),
            "rating": 4.6,
            "numReviews": 87,
            "price": 9.99,
            "countInStock": 10,
        },
        {
            "name": "Smart Watch Pro",
            "image": "smartwatch.png",
            "brand": "ChronoX",
            "category": "Wearables",
            "description": (
                "Always-on AMOLED display, GPS, SpO2, heart rate monitoring, "
                "7-day battery life. Compatible with both Android and iOS."
            ),
            "rating": 4.3,
            "numReviews": 95,
            "price": 7.99,
            "countInStock": 30,
        },
        {
            "name": "DSLR Camera 24 MP",
            "image": "camera.png",
            "brand": "Opticore",
            "category": "Photography",
            "description": (
                "24 megapixel APS-C sensor, 4K video, dual pixel autofocus, "
                "weather-sealed body. Includes 18-55 mm kit lens and 64 GB SD card."
            ),
            "rating": 4.8,
            "numReviews": 63,
            "price": 8.49,
            "countInStock": 8,
        },
        {
            "name": "Over-Ear Noise Cancelling Headphones",
            "image": "headphones.png",
            "brand": "SoundWave",
            "category": "Electronics",
            "description": (
                "40 mm drivers, active noise cancellation, 35-hour battery, "
                "foldable design with premium leather cushions. "
                "Perfect for travel and studio use."
            ),
            "rating": 4.4,
            "numReviews": 152,
            "price": 6.99,
            "countInStock": 20,
        },
        {
            "name": "Mechanical Gaming Keyboard",
            "image": "keyboard.png",
            "brand": "KeyStrike",
            "category": "Accessories",
            "description": (
                "75% compact layout, Cherry MX Red switches, per-key RGB, "
                "PBT double-shot keycaps, USB-C detachable cable. "
                "Anti-ghosting with N-key rollover."
            ),
            "rating": 4.5,
            "numReviews": 74,
            "price": 5.99,
            "countInStock": 15,
        },
        {
            "name": "Android Tablet with Stylus",
            "image": "tablet.png",
            "brand": "NovaTech",
            "category": "Computers",
            "description": (
                "11\" 2K display, Snapdragon 870, 6 GB RAM, 128 GB storage, "
                "8000 mAh battery. Includes magnetic stylus for drawing and note-taking."
            ),
            "rating": 4.2,
            "numReviews": 41,
            "price": 9.29,
            "countInStock": 12,
        },
        {
            "name": "Portable Bluetooth Speaker",
            "image": "speaker.png",
            "brand": "BassBoom",
            "category": "Electronics",
            "description": (
                "360° surround sound, IPX7 waterproof, 24-hour playtime, "
                "USB-C charging, built-in microphone. "
                "Great for outdoor adventures."
            ),
            "rating": 4.1,
            "numReviews": 110,
            "price": 3.99,
            "countInStock": 35,
        },
        {
            "name": "RGB Ergonomic Gaming Mouse",
            "image": "gaming_mouse.png",
            "brand": "PrecisionX",
            "category": "Accessories",
            "description": (
                "16000 DPI optical sensor, 7 programmable buttons, "
                "honeycomb shell for ultra-light weight (69 g), "
                "PTFE glide pads, RGB underglow. Plug-and-play USB."
            ),
            "rating": 4.6,
            "numReviews": 88,
            "price": 4.49,
            "countInStock": 22,
        },
    ]

    for p in products:
        product = Product(
            user=admin_user,
            name=p["name"],
            image=p["image"],       # stored filename; Django serves via MEDIA_URL
            brand=p["brand"],
            category=p["category"],
            description=p["description"],
            rating=p["rating"],
            numReviews=p["numReviews"],
            price=p["price"],
            countInStock=p["countInStock"],
        )
        product.save()
        print(f"  ✓ {p['name']}")

    print("\nSeeding complete!")


if __name__ == "__main__":
    run()
