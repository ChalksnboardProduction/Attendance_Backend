const Cart = require('../models/Cart');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

exports.getAllCarts = async (req, res) => {
  console.log('GET /cart - getAllCarts called');
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (err) {
    console.log('Error in getAllCarts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCartById = async (req, res) => {
  console.log('GET /cart/:id - getCartById called with id:', req.params.id);
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    console.log('Error in getCartById:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createCart = async (req, res) => {
  console.log('POST /cart - createCart called with body:', req.body);
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json(cart);
  } catch (err) {
    console.log('Error in createCart:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  console.log('PUT /cart/:id - updateCart called with id:', req.params.id, 'body:', req.body);
  try {
    const [updated] = await Cart.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Cart not found' });
    const updatedCart = await Cart.findByPk(req.params.id);
    res.json(updatedCart);
  } catch (err) {
    console.log('Error in updateCart:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  console.log('DELETE /cart/:id - deleteCart called with id:', req.params.id);
  try {
    const deleted = await Cart.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Cart not found' });
    res.json({ message: 'Cart deleted' });
  } catch (err) {
    console.log('Error in deleteCart:', err);
    res.status(500).json({ error: err.message });
  }
}; 