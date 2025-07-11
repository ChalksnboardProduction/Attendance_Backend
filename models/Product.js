const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  images: { type: DataTypes.JSON }, // array of strings
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
});

module.exports = Product; 