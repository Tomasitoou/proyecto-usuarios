import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password
            });

            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Llamar callback de éxito
            onLoginSuccess(response.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="brand-section">
                    <div className="logo-pulse">
                        <div className="pulse-wave"></div>
                        <div className="pulse-core">⚡</div>
                    </div>
                    <h1 className="brand-name">TechPulse Pro</h1>
                    <p className="brand-tagline">Potenciando tu futuro digital</p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-box">
                    <h2 className="login-title">Bienvenido de vuelta</h2>
                    <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p cl assName="demo-credentials">
                            <strong>Demo:</strong> cualquier usuario con password: <code>12345</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;