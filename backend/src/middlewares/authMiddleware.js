const jwt = require('jsonwebtoken');
// jsonwebtoken → librería para crear y verificar tokens

// ─── ¿Qué es un token JWT? ────────────────────────
// Es una cadena de texto encriptada que prueba que
// el usuario ya inició sesión. Ejemplo:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

const verificarToken = (req, res, next) => {
  // El token viene en el header de la petición
  // Formato: Authorization: Bearer eyJ...
  const authHeader = req.headers['authorization'];

  // Extraer solo el token (quitar la palabra 'Bearer ')
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token → rechazar la petición
  if (!token) {
    return res.status(401).json({
      mensaje: 'Acceso denegado. Debes iniciar sesión primero.'
    });
  }

  try {
    // Verificar que el token sea válido y no haya expirado
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos; // Guardar los datos del usuario en req
    next(); // Continuar al siguiente paso (el controlador)
  } catch (error) {
    return res.status(403).json({
      mensaje
: 'Token inválido o expirado. Inicia sesión de nuevo.'
    });
  }
};
module.exports = { verificarToken };