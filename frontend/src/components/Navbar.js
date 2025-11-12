import React from 'react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="logo-mini">⚡</div>
                    <span className="brand-text">TechPulse Pro</span>
                </div>

                <div className="navbar-user">
                    <div className="user-info">
                        <div className="user-avatar">{user.nombre.charAt(0)}</div>
                        <div className="user-details">
                            <span className="user-name">{user.nombre}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={onLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;