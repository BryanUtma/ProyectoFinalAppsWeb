const express = require('express');
const router  = express.Router();
const { verTodos, verUno, agregar, actualizar } = require('../controllers/usuariosController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Proteger TODAS las rutas de usuarios con JWT
router.use(verificarToken);
// ↑ Esto aplica verificarToken a todas las rutas de abajo

// GET    /api/usuarios      → Obtener todos
router.get('/',     verTodos);

// GET    /api/usuarios/:id  → Obtener uno por ID
router.get('/:id',  verUno);

// POST   /api/usuarios      → Crear nuevo
router.post('/',    agregar);

// PUT    /api/usuarios/:id  → Actualizar
router.put('/:id',  actualizar);

// ❌ No hay DELETE — como lo pediste

module.exports = router;