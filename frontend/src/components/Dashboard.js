import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import UserForm from './UserForm';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/usuarios');
            setUsers(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:5001/api/usuarios/${id}`);
                fetchUsers();
            } catch (error) {
                alert('Error al eliminar usuario');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingUser(null);
        fetchUsers();
    };

    const filteredUsers = users.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Navbar user={user} onLogout={onLogout} />

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div>
                        <h1>Gestión de Usuarios</h1>
                        <p className="subtitle">Administra y controla todos los usuarios del sistema</p>
                    </div>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <span className="btn-icon">+</span>
                        Nuevo Usuario
                    </button>
                </div>

                <div className="search-section">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="users-count">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
                    </div>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Cargando usuarios...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar">{u.nombre.charAt(0)}</div>
                                                <span>{u.nombre}</span>
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>{u.telefono || '-'}</td>
                                        <td>{new Date(u.fecha_registro).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(u)}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(u.id)}
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="empty-state">
                                <span className="empty-icon">📭</span>
                                <h3>No se encontraron usuarios</h3>
                                <p>Intenta con otro término de búsqueda</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showForm && (
                <UserForm
                    user={editingUser}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}

export default Dashboard;