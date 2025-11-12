const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/Auth');

const app = express();
const PORT = 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Usuarios funcionando correctamente',
        endpoints: {
            usuarios: '/api/usuarios',
            login: '/api/auth/login',
            register: '/api/auth/register'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📝 Endpoints disponibles:`);
    console.log(`   - GET    /api/usuarios`);
    console.log(`   - GET    /api/usuarios/:id`);
    console.log(`   - POST   /api/usuarios`);
    console.log(`   - PUT    /api/usuarios/:id`);
    console.log(`   - DELETE /api/usuarios/:id`);
    console.log(`   - POST   /api/auth/login`);
    console.log(`   - POST   /api/auth/register`);
});