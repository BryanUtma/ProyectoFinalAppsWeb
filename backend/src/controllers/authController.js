const prisma = require('../config/db');
const jwt    = require('jsonwebtoken');
// dotenv ya fue cargado en index.js

// ─── FUNCIÓN DE LOGIN ────────────────────────────
// Se activa cuando Angular hace: POST /api/auth/login
const login = async (req, res) => {
  try {
    // 1. Recibir los datos que mandó Angular
    const { username, password } = req.body;
    // req.body contiene: { username: 'betzaproa', password: '12345' }

    // 2. Buscar el usuario en tu tabla 'login'
    const usuario = await prisma.login.findFirst({
      where: {
        username: username,  // Buscar por nombre de usuario
        password: password   // Y que la contraseña coincida
      }
    });

    // 3. Si no existe → credenciales incorrectas
    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // 4. Si existe → generar un token JWT
    const token = jwt.sign(
      // Datos que se guardan DENTRO del token:
      { login_id: usuario.login_id, username: usuario.username },
      // Clave secreta para firmar el token:
      process.env.JWT_SECRET,
      // Tiempo de expiración:
      { expiresIn: '8h' } // Dura 8 horas
    );

    // 5. Responder con el token y datos básicos del usuario
    res.json({
      mensaje: 'Login exitoso',
      token:   token,
      usuario: {
        login_id: usuario.login_id,
        username: usuario.username
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ─── FUNCIÓN: VERIFICAR TOKEN ─────────────────────
// Ruta de prueba para verificar si el token es válido
const perfil = async (req, res) => {
  // req.usuario viene del middleware verificarToken
  res.json({
    mensaje: 'Token válido',
    usuario: req.usuario
  });
};

module.exports = { login, perfil };