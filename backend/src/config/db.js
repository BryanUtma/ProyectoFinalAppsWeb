const { PrismaClient } = require('@prisma/client');
// PrismaClient → es la clase que genera Prisma para hablar con tu BD

// Crear UNA SOLA instancia de la conexión
// (como abrir una sola puerta a la base de datos)
const prisma = new PrismaClient();

// Exportar para usarla en otros archivos
module.exports = prisma;