const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const User = require("./User");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "cancelled"),
    defaultValue: "pending",
  },
});

Order.belongsTo(User);
User.hasMany(Order);

module.exports = Order;
