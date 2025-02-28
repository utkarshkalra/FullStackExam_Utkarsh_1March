const User = require("../models/sql/User");
const { generateToken } = require("../config/auth");

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name, address, adminCode } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Check admin code if provided
      const isAdmin = adminCode === process.env.ADMIN_SECRET_CODE;

      // Create new user with address
      const user = await User.create({
        email,
        password,
        name,
        address,
        isAdmin,
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          address: user.address,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken(user.id);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          address: user.address,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
}

module.exports = new AuthController();
