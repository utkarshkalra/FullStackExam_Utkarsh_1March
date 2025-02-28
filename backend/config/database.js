const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// SQLite Configuration (replacing SQL config)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // This will create a SQLite database file in your project root
  logging: false,
});

// MongoDB Configuration
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectMongoDB,
};
