const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Register user (name and phone only)
router.post('/register-phone', userController.createUser);
router.post('/', userController.createUser);

// Login user by phone number
router.post('/login', userController.loginUser);

module.exports = router; 