const prisma = require("../database/prisma/client");

async function connectToTestDatabase() {
   try {
      await prisma.$connect();
   } catch (error) {
      console.error("Failed to connect to the test database:", error);
      throw error;
   }
}

async function disconnectFromTestDatabase() {
   try {
      await prisma.$disconnect();
   } catch (error) {
      console.error("Failed to disconnect from the test database:", error);
   }
}

module.exports = {
   connectToTestDatabase: connectToTestDatabase,
   disconnectFromTestDatabase: disconnectFromTestDatabase,
};
