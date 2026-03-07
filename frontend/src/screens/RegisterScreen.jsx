/* RegisterScreen.jsx — New user registration form */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../context/StoreContext';
import Message from '../components/Message';
import Loader from '../components/Loader';

function RegisterScreen() {
    const navigate = useNavigate();
    const { dispatch } = useContext(StoreContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('http://127.0.0.1:8000/api/users/register/', { name, email, password });
            dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper main-content animate-in">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Sign up to start shopping on ShopX.
                </p>

                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" placeholder="John Doe" value={name}
                            onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-control" placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="••••••••" value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" placeholder="••••••••" value={confirm}
                            onChange={(e) => setConfirm(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        Register
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in →</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterScreen;
