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

const bcrypt = require('bcryptjs');

// Register user with name, phone, password and role
exports.createUser = async (req, res) => {
  console.log("============================================");
  try {
    console.log("[createUser] req.body:", req.body);
    const { name, phone, password, role } = req.body;
    if (!name || !phone || !password) {
      console.log("[createUser] Missing required fields");
      return res.status(400).json({ error: 'Name, phone and password are required' });
    }
    // Check if phone exists
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      console.log("[createUser] Phone already registered");
      return res.status(400).json({ error: 'Phone already registered' });
    }

    // Check Requester Role (RBAC Hierarchy)
    // Assumes auth middleware populates req.user
    const requesterRole = req.user ? req.user.role : null;
    const requestedRole = role || 'EMPLOYEE';

    if (requesterRole === 'ADMIN') {
      if (requestedRole !== 'HR') {
        return res.status(403).json({ error: 'Admins can only create HR accounts.' });
      }
    } else if (requesterRole === 'HR') {
      if (requestedRole !== 'EMPLOYEE') {
        return res.status(403).json({ error: 'HR can only create Employee accounts.' });
      }
    } else {
      // If no user found (should be caught by auth middleware) or invalid role
      return res.status(403).json({ error: 'You do not have permission to create users.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const user = await User.create({ name, phone, password: hashedPassword, role: requestedRole });
    console.log("[createUser] User created with id:", user.id);
    res.status(201).json({
      message: 'User created',
      user: { id: user.id, name, phone, role: user.role }
    });
  } catch (err) {
    console.log("[createUser] error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Login user by phone number
// Login user by phone number and password
exports.loginUser = async (req, res) => {
  try {
    console.log("[loginUser] req.body:", req.body);
    const { phone, password } = req.body;

    if (!phone || !password) {
      console.log("[loginUser] Phone and password required");
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    // Find user by phone number
    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {
      console.log("[loginUser] User not found with phone:", phone);
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("[loginUser] User logged in successfully:", user.id);

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
    });

  } catch (err) {
    console.log("[loginUser] error:", err);
    res.status(500).json({ error: err.message });
  }
}; 