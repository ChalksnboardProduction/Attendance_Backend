const User = require('../models/User'); // Sequelize User model
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const NODE_ENV = process.env.NODE_ENV || 'development';

exports.getAllUsers = async (req, res) => {
  try {
    console.log("[getAllUsers] called");
    const users = await User.findAll({ attributes: ['id', 'name', 'phone'] });
    res.json(users);
  } catch (err) {
    console.log("[getAllUsers] error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    console.log("[getUserById] req.params:", req.params);
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'phone'] });
    if (!user) {
      console.log("[getUserById] User not found");
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.log("[getUserById] error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Register user with name and phone only
exports.createUser = async (req, res) => {
  console.log("============================================");
  try {
    console.log("[createUser] req.body:", req.body);
    const { name, phone } = req.body;
    if (!name || !phone) {
      console.log("[createUser] Missing required fields");
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    // Check if phone exists
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      console.log("[createUser] Phone already registered");
      return res.status(400).json({ error: 'Phone already registered' });
    }
    // Insert user
    const user = await User.create({ name, phone });
    console.log("[createUser] User created with id:", user.id);
    res.status(201).json({
      message: 'User created',
      user: { id: user.id, name, phone }
    });
  } catch (err) {
    console.log("[createUser] error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Login user by phone number
exports.loginUser = async (req, res) => {
  try {
    console.log("[loginUser] req.body:", req.body);
    const { phone } = req.body;
    
    if (!phone) {
      console.log("[loginUser] Phone number is required");
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Find user by phone number
    const user = await User.findOne({ 
      where: { phone },
      attributes: ['id', 'name', 'phone']
    });

    if (!user) {
      console.log("[loginUser] User not found with phone:", phone);
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

         console.log("[loginUser] User logged in successfully:", user.id);
     
     // Generate JWT token
     const jwt = require('jsonwebtoken');
     const token = jwt.sign(
       { userId: user.id, phone: user.phone },
       JWT_SECRET,
       { expiresIn: '7d' }
     );
     
     res.status(200).json({
       message: 'Login successful',
       token,
       user: { id: user.id, name: user.name, phone: user.phone }
     });

  } catch (err) {
    console.log("[loginUser] error:", err);
    res.status(500).json({ error: err.message });
  }
}; 