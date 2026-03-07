from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('users/login/', views.loginUser, name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='register'),
    path('users/profile/', views.getUserProfile, name='users-profile'),

    # Products
    path('products/', views.getProducts, name="products"),
    path('products/<str:pk>/', views.getProduct, name="product"),
    path('products/<str:pk>/reviews/', views.createProductReview, name="create-review"),

    # Orders
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),

    # Razorpay
    path('orders/<str:pk>/razorpay/', views.createRazorpayOrder, name='razorpay'),
]
