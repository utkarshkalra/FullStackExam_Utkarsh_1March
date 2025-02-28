const { sequelize } = require("../config/database");
const Order = require("../models/sql/Order");
const OrderItem = require("../models/sql/OrderItem");
const Cart = require("../models/mongodb/Cart");
const Product = require("../models/mongodb/Product");
const User = require("../models/sql/User");

class OrderController {
  async createOrder(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate({
        path: "items.productId",
        select: "price stock",
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Calculate total and verify stock
      let total = 0;
      for (const item of cart.items) {
        if (item.productId.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Insufficient stock for product ${item.productId._id}`,
          });
        }
        total += item.productId.price * item.quantity;
      }

      // Create order
      const order = await Order.create(
        {
          UserId: req.user.id,
          total,
          status: "pending",
        },
        { transaction }
      );

      // Create order items and update product stock
      const orderItems = [];
      for (const item of cart.items) {
        orderItems.push(
          OrderItem.create(
            {
              orderId: order.id,
              productId: item.productId._id.toString(),
              quantity: item.quantity,
              price: item.productId.price,
            },
            { transaction }
          )
        );

        // Update product stock
        await Product.findByIdAndUpdate(item.productId._id, {
          $inc: { stock: -item.quantity },
        });
      }

      await Promise.all(orderItems);

      // Clear cart
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { items: [] } }
      );

      await transaction.commit();

      res.status(201).json({
        orderId: order.id,
        total: order.total,
        status: order.status,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  async getOrders(req, res) {
    console.log("req.user", req.user);
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [OrderItem],
        order: [["createdAt", "DESC"]],
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  async getOrder(req, res) {
    try {
      const order = await Order.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: [OrderItem],
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }

  async getAllOrders(req, res) {
    try {
      console.log("fetching all orders");
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
          OrderItem,
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      await order.update({ status });
      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
}

module.exports = new OrderController();
