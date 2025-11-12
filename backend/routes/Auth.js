const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Ruta de Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validar que vengan los datos
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email y contraseña son requeridos'
        });
    }

    // Buscar usuario en la base de datos
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error en el login:', err);
            return res.status(500).json({
                error: 'Error en el servidor',
                details: err.message
            });
        }

        // Verificar si existe el usuario
        if (results.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const user = results[0];

        // Verificar contraseña (en producción usar bcrypt)
        if (user.password !== password) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Login exitoso - no enviar el password
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            message: 'Login exitoso',
            user: userWithoutPassword
        });
    });
});

// Ruta de Registro (opcional)
router.post('/register', (req, res) => {
    const { nombre, email, telefono, password } = req.body;

    // Validación
    if (!nombre || !email || !password) {
        return res.status(400).json({
            error: 'Nombre, email y contraseña son requeridos'
        });
    }

    // Insertar nuevo usuario
    const query = 'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre, email, telefono || null, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    error: 'El email ya está registrado'
                });
            }
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({
                error: 'Error al registrar usuario',
                details: err.message
            });
        }

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });
    });
});

module.exports = router;