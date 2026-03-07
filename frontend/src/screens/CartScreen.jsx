/* CartScreen.jsx — Shopping cart with quantity controls and checkout */
import React, { useContext, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../context/StoreContext';
import Message from '../components/Message';

function CartScreen() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    /* Parse qty from URL query string, e.g. /cart/3?qty=2 → 2 */
    const qty = location.search ? Number(location.search.split('=')[1]) : 1;

    const { state, dispatch } = useContext(StoreContext);
    const { cartItems } = state.cart;

    /* When arriving from product page, add that product to cart */
    useEffect(() => {
        if (!id) return;
        axios
            .get(`http://127.0.0.1:8000/api/products/${id}/`)
            .then(({ data }) => {
                dispatch({
                    type: 'CART_ADD_ITEM',
                    payload: {
                        product: data._id,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                        countInStock: data.countInStock,
                        qty,
                    },
                });
            });
    }, [id, qty, dispatch]);

    /* Persist cart to localStorage whenever it changes */
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const removeItem = (pid) => dispatch({ type: 'CART_REMOVE_ITEM', payload: pid });
    const totalItems = cartItems.reduce((a, i) => a + i.qty, 0);
    const totalPrice = cartItems.reduce((a, i) => a + i.qty * i.price, 0).toFixed(2);

    /* Proceed to shipping (must be logged in) */
    const checkoutHandler = () => {
        state.userLogin.userInfo ? navigate('/shipping') : navigate('/login?redirect=shipping');
    };

    return (
        <div className="container main-content animate-in">
            <h2 className="section-title">Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <Message variant="info">
                    Your cart is empty. <Link to="/">Go shopping →</Link>
                </Message>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                    {/* Cart items list */}
                    <div className="panel" style={{ padding: '0.5rem 1.25rem' }}>
                        {cartItems.map((item) => (
                            <div key={item.product} className="order-item-row">
                                <img
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt={item.name}
                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                />
                                <Link to={`/product/${item.product}`} className="order-item-name">
                                    {item.name}
                                </Link>

                                {/* Quantity updater */}
                                <select
                                    className="form-control"
                                    style={{ width: 'auto', padding: '0.35rem 0.6rem' }}
                                    value={item.qty}
                                    onChange={(e) =>
                                        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, qty: Number(e.target.value) } })
                                    }
                                >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </select>

                                <span className="order-item-meta">₹{item.price}</span>

                                <button
                                    className="btn btn-danger"
                                    style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                                    onClick={() => removeItem(item.product)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order summary */}
                    <div className="panel">
                        <h3 className="panel-title">Order Summary</h3>
                        <div className="row-between">
                            <span>Items ({totalItems})</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between total">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ marginTop: '1.25rem' }}
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartScreen;
