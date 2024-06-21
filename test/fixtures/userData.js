module.exports = {
   admin: {
      email: "admin@example.com",
      password: "12345678",
   },
   newUser: {
      name: "TestUser",
      email: "test@user.com",
      password: "12345",
   },
   duplicateUser: {
      name: "TestUser2",
      email: "test@user.com",
      password: "12345",
   },
   invalidEmailUser: {
      name: "TestUser3",
      email: "invalidemail",
      password: "12345",
   },
   shortPasswordUser: {
      name: "TestUser4",
      email: "test4@user.com",
      password: "123",
   },
   loginUser: {
      email: "test@user.com",
      password: "12345",
   },
};
