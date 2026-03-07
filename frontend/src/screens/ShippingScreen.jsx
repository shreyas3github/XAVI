/* ShippingScreen.jsx — Collects the delivery address before order placement */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreContext from '../context/StoreContext';

function ShippingScreen() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(StoreContext);

    /* Pre-fill form from saved address if user already entered it */
    const saved = state.cart.shippingAddress;
    const [address, setAddress] = useState(saved.address || '');
    const [city, setCity] = useState(saved.city || '');
    const [postalCode, setPostalCode] = useState(saved.postalCode || '');
    const [country, setCountry] = useState(saved.country || 'India');

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch({
            type: 'CART_SAVE_SHIPPING_ADDRESS',
            payload: { address, city, postalCode, country },
        });
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/placeorder');
    };

    return (
        <div className="auth-wrapper main-content animate-in">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2>Shipping Address</h2>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Where should we deliver your order?
                </p>

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label">Street Address</label>
                        <input type="text" className="form-control" placeholder="123 Main St, Apt 4"
                            value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" placeholder="Mumbai"
                            value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Postal Code</label>
                        <input type="text" className="form-control" placeholder="400001"
                            value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Country</label>
                        <input type="text" className="form-control" placeholder="India"
                            value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                        Continue to Order Summary →
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ShippingScreen;
