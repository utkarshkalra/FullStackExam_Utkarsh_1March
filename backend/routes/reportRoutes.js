const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const authenticate = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// All report routes are admin-only
router.use(authenticate, adminAuth);

router.get("/daily-revenue", ReportController.getDailyRevenue);
router.get("/top-spenders", ReportController.getTopSpenders);
router.get("/category-sales", ReportController.getCategorySales);

module.exports = router;
