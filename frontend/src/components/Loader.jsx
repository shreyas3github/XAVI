/* Loader.jsx — Centered spinner shown during data fetching */
import React from 'react';

function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="spinner" role="status" aria-label="Loading..." />
    </div>
  );
}

export default Loader;
