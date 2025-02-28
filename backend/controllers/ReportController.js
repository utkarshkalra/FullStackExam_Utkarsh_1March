const { sequelize } = require("../config/database");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Order = require("../models/sql/Order");
const User = require("../models/sql/User");
const Product = require("../models/mongodb/Product");

class ReportController {
  async getDailyRevenue(req, res) {
    console.log(Op);
    try {
      const dailyRevenue = await Order.findAll({
        attributes: [
          [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
          [sequelize.fn("SUM", sequelize.col("total")), "revenue"],
        ],
        where: {
          status: "completed",
          createdAt: {
            [Op.gte]: sequelize.literal("DATE('now', '-7 days')"),
          },
        },
        group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
        order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
      });

      res.json(dailyRevenue);
    } catch (error) {
      console.error("Error generating daily revenue report:", error);
      res
        .status(500)
        .json({ error: "Failed to generate daily revenue report" });
    }
  }

  async getTopSpenders(req, res) {
    try {
      const topSpenders = await Order.findAll({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("total")), "totalSpent"],
        ],
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
            required: true,
          },
        ],
        where: { status: "completed" },
        group: ["UserId", "User.id", "User.name", "User.email"],
        order: [[sequelize.fn("SUM", sequelize.col("total")), "DESC"]],
        limit: 5,
      });

      // Format the response
      const formattedTopSpenders = topSpenders.map((spender) => ({
        userId: spender.User.id,
        name: spender.User.name,
        email: spender.User.email,
        totalSpent: parseFloat(spender.dataValues.totalSpent),
      }));

      res.json(formattedTopSpenders);
    } catch (error) {
      console.error("Error generating top spenders report:", error);
      res.status(500).json({ error: "Failed to generate top spenders report" });
    }
  }

  async getCategorySales(req, res) {
    try {
      const categorySales = await Product.aggregate([
        {
          $group: {
            _id: "$category",
            totalProducts: { $sum: 1 },
            averagePrice: { $avg: "$price" },
          },
        },
        {
          $sort: { totalProducts: -1 },
        },
      ]);

      res.json(categorySales);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to generate category sales report" });
    }
  }
}

module.exports = new ReportController();
