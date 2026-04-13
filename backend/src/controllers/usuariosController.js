const prisma = require('../config/db');

// ─── VER TODOS ────────────────────────────────────
// GET /api/usuarios
// Devuelve todos los registros de la tabla login
const verTodos = async (req, res) => {
  try {
    const usuarios = await prisma.login.findMany({
      // Seleccionar solo los campos que se mostrarán
      // (NO incluir password por seguridad)
      select: {
        login_id: true,
        username: true,
        lduser:   true
      },
      orderBy: { login_id: 'asc' } // Ordenar por ID
    });

    res.json({
      total:    usuarios.length,
      usuarios: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// ─── VER UNO POR ID ──────────────────────────────
// GET /api/usuarios/:id
const verUno = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Convertir a número

    const usuario = await prisma.login.findUnique({
      where: { login_id: id }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // No devolver la contraseña
    const { password, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar usuario' });
  }
};

// ─── AGREGAR NUEVO ───────────────────────────────
// POST /api/usuarios
// Angular manda: { username, password, lduser }
const agregar = async (req, res) => {
  try {
    const { username, password, lduser } = req.body;

    // Validar que vengan los datos requeridos
    if (!username || !password) {
      return res.status(400).json({
        mensaje: 'Username y password son requeridos'
      });
    }

    // Verificar que el username no exista ya
    const existe = await prisma.login.findFirst({
      where: { username: username }
    });

    if (existe) {
      return res.status(400).json({
        mensaje: 'Ese username ya existe en la base de datos'
      });
    }

    // Crear el nuevo registro en la tabla login
    const nuevo = await prisma.login.create({
      data: {
        username: username,
        password: password,
        lduser:   lduser ? parseInt(lduser) : null
      }
    });

    res.status(201).json({
      mensaje:  'Usuario creado exitosamente',
      login_id: nuevo.login_id,
      username: nuevo.username
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

// ─── ACTUALIZAR ──────────────────────────────────
// PUT /api/usuarios/:id
// Angular manda los campos que quiere cambiar
const actualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, password, lduser } = req.body;

    // Verificar que el usuario existe
    const existe = await prisma.login.findUnique({
      where: { login_id: id }
    });

    if (!existe) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar solo los campos que vengan
    const actualizado = await prisma.login.update({
      where: { login_id: id },
      data: {
        username: username || existe.username,
        password: password || existe.password,
        lduser:   lduser !== undefined ? parseInt(lduser) : existe.lduser
      }
    });

    res.json({
      mensaje:   'Usuario actualizado correctamente',
      login_id:  actualizado.login_id,
      username:  actualizado.username
    });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

module.exports = { verTodos, verUno, agregar, actualizar };