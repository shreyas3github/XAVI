/* LoginScreen.jsx — User sign-in form */
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../context/StoreContext';
import Message from '../components/Message';
import Loader from '../components/Loader';

function LoginScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dispatch } = useContext(StoreContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* Redirect destination after login */
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://127.0.0.1:8000/api/users/login/', { email, password });
            dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper main-content animate-in">
            <div className="auth-card">
                <h2>Sign In</h2>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Welcome back! Enter your credentials to continue.
                </p>

                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    New here? <Link to="/register">Create an account →</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginScreen;
