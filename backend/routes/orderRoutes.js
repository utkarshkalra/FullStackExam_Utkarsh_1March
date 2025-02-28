const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const authenticate = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// User routes
router.post("/", authenticate, OrderController.createOrder);
router.get("/", authenticate, OrderController.getOrders);
router.get("/:id", authenticate, OrderController.getOrder);

// Admin routes
router.get("/admin/all", authenticate, adminAuth, OrderController.getAllOrders);
router.patch(
  "/admin/:id/status",
  authenticate,
  adminAuth,
  OrderController.updateOrderStatus
);

module.exports = router;
