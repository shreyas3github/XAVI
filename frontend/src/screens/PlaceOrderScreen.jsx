/* PlaceOrderScreen.jsx — Order summary + triggers Razorpay payment */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../context/StoreContext';
import Message from '../components/Message';
import Loader from '../components/Loader';

function PlaceOrderScreen() {
    const { state, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();
    const { cart, userLogin } = state;

    /* Razorpay SDK ready flag */
    const [sdkReady, setSdkReady] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /* Dynamically inject the Razorpay checkout script */
    useEffect(() => {
        if (window.Razorpay) { setSdkReady(true); return; }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setSdkReady(true);
        script.onerror = () => setError('Failed to load payment gateway. Check your internet connection.');
        document.body.appendChild(script);
    }, []);

    /* Redirect to shipping if address is missing */
    if (!cart.shippingAddress.address) navigate('/shipping');

    /* Price calculations */
    const itemsPrice = cart.cartItems.reduce((a, i) => a + i.price * i.qty, 0).toFixed(2);
    const shippingPrice = Number(itemsPrice) > 100 ? '0.00' : '10.00';
    const taxPrice = (0.082 * Number(itemsPrice)).toFixed(2);
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    /* Place order then open Razorpay modal */
    const placeOrderHandler = async () => {
        if (!sdkReady) { setError('Payment SDK not loaded yet. Please wait a moment and try again.'); return; }

        setLoading(true);
        setError('');
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Token ${userLogin.userInfo.token}` },
            };

            /* 1. Create order in our DB */
            const { data: order } = await axios.post(
                'http://127.0.0.1:8000/api/orders/add/',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: 'Razorpay',
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                config
            );

            /* 2. Create Razorpay order on backend */
            const { data: rzpOrder } = await axios.post(
                `http://127.0.0.1:8000/api/orders/${order._id}/razorpay/`,
                {},
                config
            );

            setLoading(false);

            /* 3. Open Razorpay modal (card-only) */
            const options = {
                key: 'rzp_test_SNvnmMPGzWgoUx',
                amount: parseInt(parseFloat(totalPrice) * 100),
                currency: 'INR',
                name: 'ShopX',
                description: `Order #${order._id}`,
                order_id: rzpOrder.id,
                handler: async (response) => {
                    /* Payment success → update order status */
                    await axios.put(
                        `http://127.0.0.1:8000/api/orders/${order._id}/pay/`,
                        response,
                        config
                    );
                    dispatch({ type: 'CART_CLEAR_ITEMS' });
                    localStorage.removeItem('cartItems');
                    navigate(`/order/${order._id}`);
                },
                prefill: { name: userLogin.userInfo.name, email: userLogin.userInfo.email },
                theme: { color: '#6366f1' },
                /* Restrict to card payments only */
                config: {
                    display: {
                        blocks: { banks: { name: 'Pay by Card', instruments: [{ method: 'card' }] } },
                        sequence: ['block.banks'],
                        preferences: { show_default_blocks: false },
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            /* On failure: save order ID and redirect to OrderScreen for retry */
            rzp.on('payment.failed', () => {
                dispatch({ type: 'CART_CLEAR_ITEMS' });
                localStorage.removeItem('cartItems');
                navigate(`/order/${order._id}`);
            });

            rzp.open();
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container main-content animate-in">
            <h2 className="section-title">Review Your Order</h2>
            <p className="section-sub">Double-check everything before paying.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* Left column — details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Shipping */}
                    <div className="panel">
                        <h3 className="panel-title">Shipping Address</h3>
                        <p style={{ fontSize: '0.9rem' }}>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Items */}
                    <div className="panel">
                        <h3 className="panel-title">Order Items</h3>
                        {cart.cartItems.length === 0 ? (
                            <Message variant="info">Cart is empty</Message>
                        ) : (
                            cart.cartItems.map((item, i) => (
                                <div key={i} className="order-item-row">
                                    <img
                                        src={`http://127.0.0.1:8000${item.image}`}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                                    />
                                    <Link to={`/product/${item.product}`} className="order-item-name">{item.name}</Link>
                                    <span className="order-item-meta">
                                        {item.qty} × ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right column — price summary + pay button */}
                <div className="panel">
                    <h3 className="panel-title">Order Summary</h3>
                    <div className="row-between"><span>Items</span><span>₹{itemsPrice}</span></div>
                    <div className="row-between"><span>Shipping</span><span>₹{shippingPrice}</span></div>
                    <div className="row-between"><span>Tax (8.2%)</span><span>₹{taxPrice}</span></div>
                    <div className="row-between total"><span>Total</span><span>₹{totalPrice}</span></div>

                    {error && <Message variant="danger">{error}</Message>}

                    <button
                        className="btn btn-primary btn-block"
                        style={{ marginTop: '1.25rem' }}
                        disabled={cart.cartItems.length === 0 || loading || !sdkReady}
                        onClick={placeOrderHandler}
                    >
                        {loading ? 'Creating order…' : !sdkReady ? 'Loading…' : '💳 Place Order & Pay'}
                    </button>
                    {loading && <Loader />}
                </div>
            </div>
        </div>
    );
}

export default PlaceOrderScreen;
