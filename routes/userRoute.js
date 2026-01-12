const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/AuthMiddleware');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Register user (name and phone only)
router.post('/', auth(), userController.createUser);

// Login user by phone number
router.post('/login', userController.loginUser);

module.exports = router; 