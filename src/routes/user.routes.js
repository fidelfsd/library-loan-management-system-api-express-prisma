const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authorizeWithAdmin = require("../middlewares/authorizeWithAdmin");

// User routes
router.get("/profile", auth, ctrl.getUserProfile);
router.put("/profile", auth, ctrl.updateUserProfile);
router.get("/favorite_books", auth, ctrl.getUserFavoriteBooks);
router.post("/favorite_books", auth, ctrl.addFavoriteBookToUser);
router.delete("/favorite_books", auth, ctrl.removeFavoriteBookFromUser);

// Protected routes
router.get("/", auth, authorizeWithAdmin(), ctrl.getAll);
router.get("/:id", auth, authorizeWithAdmin(), ctrl.getById);
router.put("/:id", auth, authorizeWithAdmin(), ctrl.update);
router.delete("/:id", auth, authorizeWithAdmin(), ctrl.delete);

module.exports = router;
