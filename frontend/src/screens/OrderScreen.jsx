/* OrderScreen.jsx — Shows an order's details and allows retrying payment */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../context/StoreContext';
import Message from '../components/Message';
import Loader from '../components/Loader';

function OrderScreen() {
    const { id } = useParams();
    const { state } = useContext(StoreContext);
    const { userLogin } = state;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* Razorpay SDK flag */
    const [sdkReady, setSdkReady] = useState(false);
    /* Cache the Razorpay order ID so a failed payment can be retried on the same order */
    const [razorpayOrderId, setRazorpayOrderId] = useState(null);

    /* Inject Razorpay script */
    useEffect(() => {
        if (!userLogin.userInfo) { window.location.href = '/login'; return; }
        if (window.Razorpay) { setSdkReady(true); }
        else {
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => setSdkReady(true);
            document.body.appendChild(s);
        }
    }, []);

    /* Fetch order details */
    useEffect(() => {
        if (!userLogin.userInfo) return;
        const config = { headers: { Authorization: `Token ${userLogin.userInfo.token}` } };
        axios
            .get(`http://127.0.0.1:8000/api/orders/${id}/`, config)
            .then(({ data }) => { setOrder(data); setLoading(false); })
            .catch((err) => { setError(err.response?.data?.detail || err.message); setLoading(false); });
    }, [id]);

    /* Mark order as paid in our backend */
    const markPaid = async (paymentResult) => {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Token ${userLogin.userInfo.token}` } };
        await axios.put(`http://127.0.0.1:8000/api/orders/${id}/pay/`, paymentResult, config);
        window.location.reload();
    };

    /* Open Razorpay modal — reuses cached order ID on retry */
    const handlePayment = async () => {
        if (!sdkReady) { alert('Payment gateway not ready. Please wait.'); return; }
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Token ${userLogin.userInfo.token}` } };

        try {
            let ordId = razorpayOrderId;
            if (!ordId) {
                const { data } = await axios.post(`http://127.0.0.1:8000/api/orders/${id}/razorpay/`, {}, config);
                ordId = data.id;
                setRazorpayOrderId(ordId);
            }

            const options = {
                key: 'rzp_test_SNvnmMPGzWgoUx',
                amount: parseInt(parseFloat(order.totalPrice) * 100),
                currency: 'INR',
                name: 'ShopX',
                description: `Order #${order._id}`,
                order_id: ordId,
                handler: (response) => markPaid(response),
                prefill: { name: userLogin.userInfo.name, email: userLogin.userInfo.email },
                theme: { color: '#6366f1' },
                config: {
                    display: {
                        blocks: { banks: { name: 'Pay by Card', instruments: [{ method: 'card' }] } },
                        sequence: ['block.banks'],
                        preferences: { show_default_blocks: false },
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (resp) =>
                alert(`Payment failed: ${resp.error.description}. Click "Retry Payment" to try again.`)
            );
            rzp.open();
        } catch (err) {
            alert('Could not open payment window: ' + (err.response?.data?.detail || err.message));
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="container main-content"><Message variant="danger">{error}</Message></div>;

    return (
        <div className="container main-content animate-in">
            <h2 className="section-title">Order #{order._id}</h2>
            <p className="section-sub">
                Placed on {order.createdAt?.slice(0, 10)} by {order.user.name}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Shipping */}
                    <div className="panel">
                        <h3 className="panel-title">Shipping</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>{order.user.name}</strong> · {order.user.email}
                        </p>
                        <p style={{ fontSize: '0.9rem' }}>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        <div style={{ marginTop: '0.75rem' }}>
                            {order.isDelivered
                                ? <Message variant="success">Delivered on {order.deliveredAt?.slice(0, 10)}</Message>
                                : <Message variant="danger">Not yet delivered</Message>}
                        </div>
                    </div>

                    {/* Payment status */}
                    <div className="panel">
                        <h3 className="panel-title">Payment</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Method: {order.paymentMethod}</p>
                        {order.isPaid
                            ? <Message variant="success">Paid ✓</Message>
                            : <Message variant="danger">Payment pending</Message>}
                    </div>

                    {/* Items */}
                    <div className="panel">
                        <h3 className="panel-title">Items Ordered</h3>
                        {order.orderItems.map((item, i) => (
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
                        ))}
                    </div>
                </div>

                {/* Right column — price summary */}
                <div className="panel">
                    <h3 className="panel-title">Order Summary</h3>
                    <div className="row-between">
                        <span>Items</span>
                        <span>₹{(order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
                    </div>
                    <div className="row-between"><span>Shipping</span><span>₹{order.shippingPrice}</span></div>
                    <div className="row-between"><span>Tax</span><span>₹{order.taxPrice}</span></div>
                    <div className="row-between total"><span>Total</span><span>₹{order.totalPrice}</span></div>

                    {/* Show pay button only if order is not yet paid */}
                    {!order.isPaid && (
                        <button
                            className="btn btn-primary btn-block"
                            style={{ marginTop: '1.25rem' }}
                            onClick={handlePayment}
                            disabled={!sdkReady}
                        >
                            {sdkReady ? '💳 Retry Payment' : 'Loading gateway…'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderScreen;
