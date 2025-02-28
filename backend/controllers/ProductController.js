const Product = require("../models/mongodb/Product");
const getRandomShoeImage = require("../utils/unsplash.js");

class ProductController {
  async listProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const category = req.query.category;

      let query = {};

      // Add search filter
      if (search) {
        query.$text = { $search: search };
      }

      // Add category filter
      if (category) {
        query.category = category;
      }

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, description, price, category, stock } = req.body;

      // Get random shoe image from Unsplash
      const imageUrl = await getRandomShoeImage();

      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        imageUrl, // This will be the Unsplash image URL
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }

  // Add this new method for bulk creation
  async createBulkProducts(req, res) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Products must be an array" });
      }

      // Process each product and add image URL
      const productsToCreate = await Promise.all(
        products.map(async (product) => ({
          ...product,
          imageUrl: await getRandomShoeImage(),
          createdBy: req.user.id, // Add the admin user who created the products
        }))
      );

      // Use MongoDB insertMany for bulk creation
      const createdProducts = await Product.insertMany(productsToCreate);

      res.status(201).json({
        message: `Successfully created ${createdProducts.length} products`,
        products: createdProducts,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({ error: "Failed to create products" });
    }
  }
}

module.exports = new ProductController();
