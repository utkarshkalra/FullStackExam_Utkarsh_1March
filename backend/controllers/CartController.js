const Cart = require("../models/mongodb/Cart");
const Product = require("../models/mongodb/Product");

class CartController {
  async getCart(req, res) {
    try {
      let cart = await Cart.findOne({ userId: req.user.id }).populate({
        path: "items.productId",
        select: "name price imageUrl stock",
      });

      if (!cart) {
        cart = await Cart.create({ userId: req.user.id, items: [] });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;

      // Verify product exists and has enough stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      let cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        cart = await Cart.create({
          userId: req.user.id,
          items: [{ productId, quantity }],
        });
      } else {
        // Check if product already exists in cart
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }

        await cart.save();
      }

      // Populate product details before sending response
      cart = await cart.populate({
        path: "items.productId",
        select: "name price imageUrl stock",
      });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  }

  async updateCartItem(req, res) {
    try {
      const { productId, quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      let cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      cart = await cart.populate({
        path: "items.productId",
        select: "name price imageUrl stock",
      });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;

      let cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
      await cart.save();

      cart = await cart.populate({
        path: "items.productId",
        select: "name price imageUrl stock",
      });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  }

  async clearCart(req, res) {
    try {
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { items: [] } }
      );
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  }
}

module.exports = new CartController();
