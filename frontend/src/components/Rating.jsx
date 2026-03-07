/* Rating.jsx — Renders star icons based on a numeric rating value */
import React from 'react';

/**
 * Props:
 *  value — rating number (0–5)
 *  text  — optional label shown next to stars (e.g. "(128)")
 */
function Rating({ value = 0, text }) {
    const stars = [1, 2, 3, 4, 5].map((n) => {
        if (value >= n) return 'full';
        if (value >= n - 0.5) return 'half';
        return 'empty';
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0.35rem 0' }}>
            <span className="rating-stars">
                {stars.map((type, i) => (
                    <span key={i} className={`star-${type}`} aria-hidden="true">
                        {type === 'full' ? '★' : type === 'half' ? '½' : '☆'}
                    </span>
                ))}
            </span>
            {text && <span className="rating-text">{text}</span>}
        </div>
    );
}

export default Rating;
