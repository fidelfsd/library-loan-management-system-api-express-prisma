const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/loanController");
const auth = require("../middlewares/auth");
const authorizeWithAdmin = require("../middlewares/authorizeWithAdmin");

// Protected routes
router.get("/", auth, authorizeWithAdmin("manager"), ctrl.getAll);
router.get("/:id", auth, authorizeWithAdmin("manager"), ctrl.getById);
router.post("/", auth, authorizeWithAdmin("manager"), ctrl.create);
router.put("/:id", auth, authorizeWithAdmin("manager"), ctrl.update);
router.delete("/:id", auth, authorizeWithAdmin("manager"), ctrl.delete);

module.exports = router;
