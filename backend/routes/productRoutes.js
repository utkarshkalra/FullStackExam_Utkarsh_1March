const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const authenticate = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Public routes
router.get("/", ProductController.listProducts);
router.get("/:id", ProductController.getProduct);

// Admin only routes
router.post("/", authenticate, adminAuth, ProductController.createProduct);
router.post(
  "/bulk",
  authenticate,
  adminAuth,
  ProductController.createBulkProducts
);
router.put("/:id", authenticate, adminAuth, ProductController.updateProduct);
router.delete("/:id", authenticate, adminAuth, ProductController.deleteProduct);

module.exports = router;
