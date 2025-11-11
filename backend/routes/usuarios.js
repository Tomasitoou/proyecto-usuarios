// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Conexión a la BD [cite: 98]

// 1. RUTA GET: Listar todos los usuarios (READ) [cite: 99-111]
router.get('/', (req, res) => {
    const query = 'SELECT * FROM usuarios ORDER BY id DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({
                error: 'Error al obtener usuarios',
                details: err.message
            });
        }
        res.json(results);
    });
});

// 2. RUTA POST: Crear un nuevo usuario (CREATE) [cite: 206]
router.post('/', (req, res) => {
    const { nombre, email, telefono } = req.body; 

    // Validación de campos requeridos (nombre y email)
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son campos requeridos.' });
    }

    const query = 'INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, telefono], (err, result) => {
        if (err) {
            console.error('Error al crear usuario:', err);
            // Error 409 Conflict si el email ya existe (definido como UNIQUE NOT NULL en la BD) [cite: 11, 12]
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El email ya está registrado.' });
            }
            return res.status(500).json({ error: 'Error interno al crear usuario.', details: err.message });
        }
        
        // Retorna el ID del usuario creado con estado 201 (Created)
        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            id: result.insertId,
            nombre, email, telefono
        });
    });
});

// 3. RUTA PUT: Actualizar un usuario por ID (UPDATE) [cite: 208]
router.put('/:id', (req, res) => {
    const userId = req.params.id; // ID del usuario a actualizar
    const { nombre, email, telefono } = req.body;

    // Validación de campos requeridos
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son campos requeridos.' });
    }

    const query = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?';
    db.query(query, [nombre, email, telefono, userId], (err, result) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El email ya está registrado en otro usuario.' });
            }
            return res.status(500).json({ error: 'Error interno al actualizar usuario.', details: err.message });
        }
        
        // Si affectedRows es 0, significa que el ID no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
        }

        res.json({ 
            message: 'Usuario actualizado exitosamente', 
            id: userId,
            nombre, email, telefono
        });
    });
});

// 4. RUTA DELETE: Eliminar un usuario por ID (DELETE) [cite: 209]
router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error interno al eliminar usuario.', details: err.message });
        }

        // Si affectedRows es 0, significa que el ID no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
        }

        res.json({ message: 'Usuario eliminado exitosamente', id: userId });
    });
});

module.exports = router;