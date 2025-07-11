const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Cart = sequelize.define('Cart', {
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  items: { type: DataTypes.JSON, allowNull: false }, // array of { productId, quantity }
}, {
  timestamps: true,
});

module.exports = Cart; 