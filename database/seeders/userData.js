const bcrypt = require("bcrypt");

const plainPassword = "12345678";
const hashedPassword = bcrypt.hashSync(plainPassword, 10);

module.exports = [
   {
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
      roleId: 1,
   },
   {
      name: "Manager",
      email: "manager@example.com",
      password: hashedPassword,
      roleId: 2,
   },
   {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "Nilu",
      email: "nilu@example.com",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "Mahmoud",
      email: "mahmoud@example.com",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "Michael",
      email: "michael@example.co",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "Emily",
      email: "emily@example.co",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "Laura",
      email: "laura@example.co",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "Robert",
      email: "robert@example.co",
      password: hashedPassword,
      roleId: 3,
   },
   {
      name: "James",
      email: "james@example.co",
      password: hashedPassword,
      roleId: 3,
   },
];
