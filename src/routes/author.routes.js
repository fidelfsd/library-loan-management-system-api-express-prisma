const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authorController");
const authorizeWithAdmin = require("../middlewares/authorizeWithAdmin");
const auth = require("../middlewares/auth");

// Public routes
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

// Protected routes
router.post("/", auth, authorizeWithAdmin(), ctrl.create);
router.put("/:id", auth, authorizeWithAdmin(), ctrl.update);
router.delete("/:id", auth, authorizeWithAdmin(), ctrl.delete);

module.exports = router;
