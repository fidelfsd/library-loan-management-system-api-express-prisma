const { disconnectFromDatabase } = require("../conection");
const prisma = require("../prisma/client");

const entitiesData = {
   role: require("./roleData"),
   author: require("./authorData"),
   book: require("./bookData"),
   user: require("./userData"),
   loan: require("./loanData"),
   favoriteBook: require("./favoriteBookData"),
};

async function seedEntity(entityName, data) {
   try {
      console.log(`🌱 Seeding ${entityName} ...`);
      await prisma[entityName].createMany({ data });
      console.log(`✅ ${entityName} seed completed\n`);
   } catch (error) {
      console.error(`❌ Error seeding ${entityName}:`, error);
      throw error;
   }
}

async function main() {
   console.log(`\n🌱 Start seeding ...\n`);

   for (const [entityName, data] of Object.entries(entitiesData)) {
      await seedEntity(entityName, data);
   }

   console.log(`✨ Seeding finished.`);
}

main()
   .catch(async (error) => {
      console.error(`❌ Seeding failed:`, error);
   })
   .finally(async () => {
      await disconnectFromDatabase();
   });
