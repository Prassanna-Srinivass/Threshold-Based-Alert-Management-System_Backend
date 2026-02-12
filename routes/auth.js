const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Test endpoint to verify login route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes working',
    loginRequires: ['username', 'password'],
    registerRequires: ['username', 'email', 'password', 'role']
  });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    console.log('Register attempt - Request body:', { ...req.body, password: '***' });
    
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide username, email, password, and role',
        required: ['username', 'email', 'password', 'role']
      });
    }

    if (!['OPERATOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Role must be OPERATOR or ADMIN' 
      });
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this username or email already exists' 
      });
    }

    const user = await User.create({ username, email, password, role });
    console.log('User registered successfully:', username);

    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// POST /api/auth/login - ONLY requires username and password
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt - Request body:', { ...req.body, password: '***' });
    
    const { username, password } = req.body;

    // Explicitly check only username and password
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide username and password',
        required: ['username', 'password']
      });
    }

    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');

    if (user && (await user.matchPassword(password))) {
      console.log('Login successful for user:', username);
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      console.log('Invalid credentials');
      res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;
