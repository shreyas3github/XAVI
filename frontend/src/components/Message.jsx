/* Message.jsx — Inline alert box for success / error / info states */
import React from 'react';

/**
 * Props:
 *  variant — 'danger' | 'success' | 'info'  (default: 'info')
 *  children — message text / elements
 */
function Message({ variant = 'info', children }) {
    return (
        <div className={`alert alert-${variant}`} role="alert">
            {children}
        </div>
    );
}

export default Message;
