const app = require("./app");
const { connectToDatabase } = require("../database/conection");
const port = process.env.PORT || 3000;

connectToDatabase()
   .then(() => {
      console.log("\n🛢️  Connected to the test database successfully.");
      app.listen(port, () =>
         console.log(`🚀 Server ready at: http://localhost:${port}\n`)
      );
   })
   .catch((e) => {
      console.error(e);
      process.exit(1);
   });
