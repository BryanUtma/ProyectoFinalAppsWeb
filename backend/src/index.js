// Cargar variables del archivo .env (SIEMPRE primero)
require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARES GLOBALES ────────────────────────

// CORS: permite que Angular (puerto 4200) llame a este servidor
app.use(cors({
  origin: 'http://localhost:4200', // Dirección de Angular
  credentials: true
}));

// Parsear JSON: para poder leer req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── RUTAS ──────────────────────────────────────
const authRoutes     = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

// Registrar las rutas con su prefijo URL:
app.use('/api/auth',     authRoutes);
// → POST /api/auth/login
// → GET  /api/auth/perfil

app.use('/api/usuarios', usuariosRoutes);
// → GET  /api/usuarios
// → GET  /api/usuarios/:id
// → POST /api/usuarios
// → PUT  /api/usuarios/:id

// ─── RUTA DE PRUEBA ─────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    estado:    'Servidor corriendo OK',
    hora:      new Date().toLocaleString('es-MX'),
    base_datos: 'logindatabase'
  });
});

// ─── ARRANCAR SERVIDOR ──────────────────────────
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`✅  Servidor corriendo en:`);
  console.log(`    http://localhost:${PORT}`);
  console.log(`    BD: logindatabase`);
  console.log('═══════════════════════════════════════');
});