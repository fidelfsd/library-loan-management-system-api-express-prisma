// Maneja la conexión y desconexión de la base de datos.
// Es agnóstico al ORM para permitir futuras expansiones o cambios.

const prisma = require("./prisma/client");

async function connectToDatabase() {
   try {
      await prisma.$connect();
   } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw error;
   }
}

async function disconnectFromDatabase() {
   try {
      await prisma.$disconnect();
   } catch (error) {
      console.error("Failed to disconnect from the database:", error);
   }
}

module.exports = {
   connectToDatabase,
   disconnectFromDatabase,
};
