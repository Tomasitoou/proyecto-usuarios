import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

function UserForm({ user, onClose }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        password: '12345'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono || '',
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (user) {
                // Actualizar usuario
                await axios.put(`http://localhost:5001/api/usuarios/${user.id}`, {
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono
                });
            } else {
                // Crear usuario
                await axios.post('http://localhost:5001/api/usuarios', formData);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="3001234567"
                        />
                    </div>

                    {!user && (
                        <div className="form-group">
                            <label htmlFor="password">Contraseña *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="form-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear Usuario')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserForm;