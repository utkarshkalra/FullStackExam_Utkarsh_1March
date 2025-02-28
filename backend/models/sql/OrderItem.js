const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const Order = require("./Order");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.STRING, // MongoDB ObjectId as string
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);

module.exports = OrderItem;
