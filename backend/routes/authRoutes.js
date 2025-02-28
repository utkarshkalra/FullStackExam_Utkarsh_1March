const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const authenticate = require("../middleware/auth");

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.get("/profile", authenticate, AuthController.getProfile);

module.exports = router;
