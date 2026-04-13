const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
// PrismaClient → es la clase que genera Prisma para hablar con tu BD

// Crear UNA SOLA instancia de la conexión
// (como abrir una sola puerta a la base de datos)
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

// Exportar para usarla en otros archivos
module.exports = prisma;