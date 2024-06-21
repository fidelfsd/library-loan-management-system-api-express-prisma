const request = require("supertest");
const app = require("../../src/app");
const userData = require("../fixtures/userData");
const {
   connectToTestDatabase,
   disconnectFromTestDatabase,
} = require("../testConnection");

let userId;
let testToken;
let adminToken;

beforeAll(async () => {
   await connectToTestDatabase();
});

afterAll(async () => {
   await disconnectFromTestDatabase();
});

// Admin Authentication to obtain token
// -----------------------------------------------------------------------------
describe("Admin Authentication", () => {
   test("should login as admin", async () => {
      const response = await request(app)
         .post("/api/auth/login")
         .send(userData.admin)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");
      const { status, body } = response;
      expect(status).toBe(200);

      expect(typeof body.token).toEqual("string");
      adminToken = body.token;
   });
});

// User Registration
// -----------------------------------------------------------------------------
describe("User Registration", () => {
   test("should register a new user", async () => {
      const response = await request(app)
         .post("/api/auth/register")
         .send(userData.newUser)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");
      const { status, body } = response;
      expect(status).toBe(200);
      expect(response.body).toHaveProperty("id");
      userId = body.id;
   });
   test("should not allow duplicate email registration", async () => {
      const response = await request(app)
         .post("/api/auth/register")
         .send(userData.duplicateUser)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");
      const { status, body } = response;
      expect(status).toBe(400);
   });
});

// User Authentication
// -----------------------------------------------------------------------------
describe("User Authentication", () => {
   test("should login an existing user", async () => {
      const response = await request(app)
         .post("/api/auth/login")
         .send(userData.loginUser)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");
      const { status, body } = response;
      expect(status).toBe(200);

      expect(typeof body.token).toEqual("string");
      testToken = body.token;
   });
});

// User Profile Management
// -----------------------------------------------------------------------------
describe("User Profile Management", () => {
   test("should retrieve user profile for authenticated user", async () => {
      const response = await request(app)
         .get("/api/users/profile")
         .set("Authorization", `Bearer ${testToken}`)
         .set("Accept", "application/json");
      const { status, body } = response;
      expect(status).toBe(200);
      expect(body.id).toBeDefined();
      expect(body.email).toBe(userData.newUser.email);
   });

   test("should update user profile for authenticated user", async () => {
      const updatedProfileData = {
         name: "Updated User",
      };

      const response = await request(app)
         .put("/api/users/profile")
         .set("Authorization", `Bearer ${testToken}`)
         .send(updatedProfileData)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
   });
});

// User Favorite Books Management
// -----------------------------------------------------------------------------
describe("User Favorite Books Management", () => {
   test("should add a favorite book to user", async () => {
      const favoriteBookData = {
         bookId: 1,
      };

      const response = await request(app)
         .post("/api/users/favorite_books")
         .set("Authorization", `Bearer ${testToken}`)
         .send(favoriteBookData)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body.bookId).toBe(favoriteBookData.bookId);
   });

   test("should retrieve user's favorite books for authenticated user", async () => {
      const response = await request(app)
         .get("/api/users/favorite_books")
         .set("Authorization", `Bearer ${testToken}`)
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Array);
   });

   test("should remove a favorite book from user", async () => {
      const favoriteBookData = {
         bookId: 1, // Debe ser el mismo libro añadido en el test anterior
      };

      const response = await request(app)
         .delete("/api/users/favorite_books")
         .set("Authorization", `Bearer ${testToken}`)
         .send(favoriteBookData)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body.message).toBe("Book removed from favorites list");
   });
});

// "User Loans Management
// -----------------------------------------------------------------------------
// describe("User Loans Management", () => {
//    test("should retrieve user's loans for authenticated user", async () => {
//       const response = await request(app)
//          .get("/api/users/loans")
//          .set("Authorization", `Bearer ${testToken}`)
//          .set("Accept", "application/json");

//       const { status, body } = response;
//       expect(status).toBe(200);
//       expect(body).toBeInstanceOf(Array);
//    });
// });

describe("Admin Protected User Management", () => {
   test("should retrieve all users for admin", async () => {
      const response = await request(app)
         .get("/api/users/")
         .set("Authorization", `Bearer ${adminToken}`)
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Array);
      expect(body.length).toBeGreaterThan(0);
   });

   test("should retrieve a user by ID for admin", async () => {
      const response = await request(app)
         .get(`/api/users/${userId}`)
         .set("Authorization", `Bearer ${adminToken}`)
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("id");
      expect(body.id).toBe(userId);
   });

   test("should update a user by ID for admin", async () => {
      const updatedUserData = {
         name: "Updated User by Admin",
      };

      const response = await request(app)
         .put(`/api/users/${userId}`)
         .set("Authorization", `Bearer ${adminToken}`)
         .send(updatedUserData)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
   });

   test("should delete a user by ID for admin", async () => {
      const response = await request(app)
         .delete(`/api/users/${userId}`)
         .set("Authorization", `Bearer ${adminToken}`)
         .set("Content-Type", "application/json")
         .set("Accept", "application/json");

      const { status } = response;
      expect(status).toBe(200);
   });
});
