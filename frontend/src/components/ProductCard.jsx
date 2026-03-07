/* ProductCard.jsx — Single product tile displayed on the home grid */
import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

/**
 * Props:
 *  product — full product object from the API
 */
function ProductCard({ product }) {
    /* Build image URL: served by Django at /images/<filename> */
    const imageUrl = `http://127.0.0.1:8000${product.image}`;

    return (
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <div className="card" role="article">
                {/* Product image */}
                <div style={{ overflow: 'hidden', lineHeight: 0 }}>
                    <img
                        className="product-card-img"
                        src={imageUrl}
                        alt={product.name}
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                </div>

                {/* Details */}
                <div className="product-card-body">
                    <p className="product-card-brand">{product.brand}</p>
                    <h3 className="product-card-name" title={product.name}>
                        {product.name}
                    </h3>
                    <Rating value={product.rating} text={`(${product.numReviews})`} />
                    <p className="product-card-price">₹{Number(product.price).toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
