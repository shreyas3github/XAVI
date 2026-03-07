/* HomeScreen.jsx — Landing page that lists all products */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomeScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* Fetch products from the Django API on mount */
    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/products/')
            .then(({ data }) => { setProducts(data); setLoading(false); })
            .catch((err) => { setError(err.message); setLoading(false); });
    }, []);

    return (
        <div className="container main-content animate-in">
            <h1 className="section-title">All Products</h1>
            <p className="section-sub">Explore our latest electronics and accessories</p>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomeScreen;
