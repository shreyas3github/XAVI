/* ProductScreen.jsx — Detailed page for a single product */
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import StoreContext from '../context/StoreContext';

function ProductScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useContext(StoreContext);

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);

    /* New review form state */
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');
    const [reviewErr, setReviewErr] = useState('');

    /* Fetch product details */
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/products/${id}/`)
            .then(({ data }) => { setProduct(data); setLoading(false); })
            .catch((err) => { setError(err.message); setLoading(false); });
    }, [id]);

    /* Add to cart → navigate to /cart/:id?qty=N */
    const addToCartHandler = () => navigate(`/cart/${id}?qty=${qty}`);

    /* Submit a review */
    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewMsg('');
        setReviewErr('');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${state.userLogin.userInfo?.token}`,
                },
            };
            await axios.post(
                `http://127.0.0.1:8000/api/products/${id}/reviews/`,
                { rating, comment },
                config
            );
            setReviewMsg('Review submitted!');
            setRating(0);
            setComment('');
            /* Refresh product to show new review */
            const { data } = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
            setProduct(data);
        } catch (err) {
            setReviewErr(err.response?.data?.detail || err.message);
        }
    };

    return (
        <div className="container main-content animate-in">
            {/* Back button */}
            <Link to="/" className="btn" style={{ marginBottom: '1.5rem' }}>
                ← Back
            </Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    {/* ── Product detail layout ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

                        {/* Image */}
                        <div className="card" style={{ overflow: 'hidden', lineHeight: 0 }}>
                            <img
                                src={`http://127.0.0.1:8000${product.image}`}
                                alt={product.name}
                                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                            />
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="panel">
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                                    {product.brand} · {product.category}
                                </p>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{product.name}</h2>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                <div className="divider" />
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{product.description}</p>
                            </div>

                            <div className="panel">
                                <div className="row-between">
                                    <span>Price</span>
                                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2rem' }}>
                                        ₹{Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                                <div className="row-between">
                                    <span>Status</span>
                                    {product.countInStock > 0 ? (
                                        <span className="badge badge-success">In Stock</span>
                                    ) : (
                                        <span className="badge badge-danger">Out of Stock</span>
                                    )}
                                </div>

                                {/* Quantity selector */}
                                {product.countInStock > 0 && (
                                    <div className="row-between" style={{ marginTop: '0.5rem' }}>
                                        <span>Qty</span>
                                        <select
                                            className="form-control"
                                            style={{ width: 'auto', padding: '0.4rem 0.7rem' }}
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button
                                    className="btn btn-primary btn-block"
                                    style={{ marginTop: '1rem' }}
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Reviews ── */}
                    <div style={{ marginTop: '3rem', maxWidth: '640px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Customer Reviews</h3>

                        {product.reviews && product.reviews.length === 0 && (
                            <Message variant="info">No reviews yet. Be the first!</Message>
                        )}

                        {product.reviews && product.reviews.map((rev) => (
                            <div key={rev._id} className="panel" style={{ marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <strong style={{ fontSize: '0.9rem' }}>{rev.name}</strong>
                                    <span className="rating-text">{rev.createdAt?.slice(0, 10)}</span>
                                </div>
                                <Rating value={rev.rating} />
                                <p style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>{rev.comment}</p>
                            </div>
                        ))}

                        {/* Write a review (logged-in users only) */}
                        {state.userLogin.userInfo && (
                            <div className="panel" style={{ marginTop: '1.5rem' }}>
                                <h4 style={{ marginBottom: '1rem' }}>Write a Review</h4>
                                {reviewMsg && <Message variant="success">{reviewMsg}</Message>}
                                {reviewErr && <Message variant="danger">{reviewErr}</Message>}
                                <form onSubmit={submitReviewHandler}>
                                    <div className="form-group">
                                        <label className="form-label">Rating</label>
                                        <select className="form-control" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                                            <option value={0}>Select…</option>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Comment</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share your experience…"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit Review</button>
                                </form>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductScreen;
