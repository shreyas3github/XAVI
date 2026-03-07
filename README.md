# XAVI — Full-Stack E-Commerce Platform

A modern, dark-themed e-commerce web application built with **Django REST Framework** (backend) and **React + Vite** (frontend), featuring Razorpay payment integration and token-based authentication.

---

## ✨ Features

- 🛍️ Browse and search products with ratings & reviews
- 🛒 Persistent shopping cart (localStorage)
- 🔐 User registration & JWT-style token authentication
- 📦 Order placement with shipping address
- 💳 Razorpay payment gateway integration (INR)
- ⭐ Product review & rating system
- 🗄️ Database seeder with 10 sample products
- 🌐 CORS-enabled REST API

---

## 🏗️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Python · Django 6 · Django REST Framework       |
| Auth      | DRF Token Authentication                        |
| Database  | SQLite3 (dev)                                   |
| Payment   | Razorpay SDK                                    |
| Frontend  | React 19 · Vite 7 · React Router DOM 7          |
| HTTP      | Axios                                           |
| Styling   | Vanilla CSS (dark theme)                        |

---

## 📁 Project Structure

```
XAVI/
├── backend/            # Django project settings & root URL config
├── ecommerce/          # Core Django app (models, views, serializers, URLs)
│   ├── models.py       # Product, Review, Order, OrderItem, ShippingAddress
│   ├── views.py        # API views (auth, products, orders, Razorpay)
│   ├── serializers.py  # DRF serializers
│   └── urls.py         # API route definitions
├── frontend/           # React + Vite SPA
│   └── src/
│       ├── screens/    # Page-level components
│       ├── components/ # Reusable UI components
│       └── context/    # Global state via useReducer (StoreContext)
├── static/images/      # Product images (served as MEDIA_URL)
├── seed.py             # Database seeder script
├── manage.py
└── db.sqlite3
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip & npm

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd XAVI
```

---

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install django djangorestframework django-cors-headers razorpay pillow

# Apply migrations
python manage.py migrate

# (Optional) Seed the database with sample products + admin user
python seed.py

# Start the development server
python manage.py runserver
```

The API will be available at **http://localhost:8000**.

---

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

The React app will be available at **http://localhost:5173**.

---

## 🔑 Default Admin Credentials (after seeding)

| Field    | Value               |
|----------|---------------------|
| Email    | admin@example.com   |
| Password | adminpass           |

Access the Django admin panel at **http://localhost:8000/admin**.

---

## 🌐 API Reference

Base URL: `http://localhost:8000/api/`

### Authentication

| Method | Endpoint              | Description          | Auth Required |
|--------|-----------------------|----------------------|---------------|
| POST   | `users/register/`     | Register a new user  | No            |
| POST   | `users/login/`        | Login & get token    | No            |
| GET    | `users/profile/`      | Get logged-in user   | ✅ Yes         |

### Products

| Method | Endpoint                      | Description           | Auth Required |
|--------|-------------------------------|-----------------------|---------------|
| GET    | `products/`                   | List all products     | No            |
| GET    | `products/<id>/`              | Get product details   | No            |
| POST   | `products/<id>/reviews/`      | Submit a review       | ✅ Yes         |

### Orders

| Method | Endpoint                      | Description           | Auth Required |
|--------|-------------------------------|-----------------------|---------------|
| POST   | `orders/add/`                 | Create a new order    | ✅ Yes         |
| GET    | `orders/<id>/`                | Get order by ID       | ✅ Yes         |
| PUT    | `orders/<id>/pay/`            | Mark order as paid    | ✅ Yes         |

### Razorpay

| Method | Endpoint                      | Description                  | Auth Required |
|--------|-------------------------------|------------------------------|---------------|
| POST   | `orders/<id>/razorpay/`       | Create Razorpay payment order | ✅ Yes         |

---

## 💳 Payment Integration

This project uses **Razorpay** in test mode.

- Payment amounts are in **INR (paise)** — multiply by 100 before sending to Razorpay.
- Test keys are configured in `ecommerce/views.py`.
- Use [Razorpay test card details](https://razorpay.com/docs/payments/payments/test-card-upi-details/) during checkout.

> ⚠️ **Important:** Replace the test API keys with your production keys before deploying.

---

## 🛢️ Database Models

| Model           | Description                                      |
|-----------------|--------------------------------------------------|
| `Product`       | Name, brand, category, price, stock, image, rating |
| `Review`        | Rating & comment linked to a product and user    |
| `Order`         | Payment method, tax, shipping, total, paid status |
| `OrderItem`     | Individual line items within an order            |
| `ShippingAddress` | Delivery address linked one-to-one to an order |

---

## 🌱 Seeder

Run `python seed.py` to populate the database with:

- **1 admin superuser** (`admin@example.com` / `adminpass`)
- **10 sample products** across categories: Electronics, Computers, Wearables, Photography, Accessories

---

## 🔧 Configuration

Key settings are in `backend/settings.py`:

```python
DEBUG = True               # Set to False in production
CORS_ALLOW_ALL_ORIGINS = True  # Restrict in production
MEDIA_URL = '/images/'     # Served product images
```

---

## 📦 Frontend State Management

Global state is managed via React's `useReducer` with a custom `StoreContext`, persisted to `localStorage`. It handles:

- **Cart** — add, remove, clear items; save shipping address
- **User** — login / logout session

---

I Have used the API directly with using .env file as it was for testing only and please make sure of it.
