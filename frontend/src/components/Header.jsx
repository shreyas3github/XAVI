/* Header.jsx — Top navigation bar with cart count and user menu */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../context/StoreContext';

function Header() {
  const { state, dispatch } = useContext(StoreContext);
  const { cart, userLogin } = state;
  const navigate = useNavigate();

  /* Total items in cart */
  const cartCount = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);

  /* Logout: clear user from state and localStorage */
  const logoutHandler = () => {
    dispatch({ type: 'USER_LOGOUT' });
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="glass-navbar">
      <div className="container nav-container">

        {/* Brand name */}
        <Link to="/" className="brand">
          Shop<span>X</span>
        </Link>

        {/* Right-side links */}
        <nav className="nav-links">

          {/* Cart */}
          <Link to="/cart" className="nav-link">
            🛒 Cart
            {cartCount > 0 && (
              <span className="nav-cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* Show user name + logout or Login button */}
          {userLogin.userInfo ? (
            <>
              <span className="nav-link" style={{ color: 'var(--text-primary)' }}>
                👤 {userLogin.userInfo.name}
              </span>
              <button
                className="btn"
                onClick={logoutHandler}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
