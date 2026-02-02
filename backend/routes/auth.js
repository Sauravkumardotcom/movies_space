import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/index.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../middleware/auth.js';
import bcryptjs from 'bcryptjs';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    {string} email - User email (must be unique)
 * @body    {string} password - User password (min 6 chars)
 * @body    {string} username - Optional username
 * @returns {Object} User object and tokens
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password hashing happens in pre-hook)
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      username: username || null,
      role: 'user'
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: savedUser._id,
      email: savedUser.email,
      role: savedUser.role
    });

    const refreshToken = generateRefreshToken({
      userId: savedUser._id,
      email: savedUser.email
    });

    // Return response (without password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        role: savedUser.role,
        avatar: savedUser.avatar
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 * @body    {string} email - User email
 * @body    {string} password - User password
 * @returns {Object} User object and tokens
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email (need to explicitly select password)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password using bcryptjs
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      email: user.email
    });

    // Return response (without password)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Generate new access token using refresh token
 * @access  Public
 * @body    {string} refreshToken - Valid refresh token
 * @returns {Object} New access and refresh tokens
 */
router.post('/refresh-token', verifyRefreshToken, async (req, res) => {
  try {
    // User data is already in req.user from middleware
    const { userId, email } = req.user;

    // Find user to get current role
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      email: user.email
    });

    return res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    return res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Protected (requires valid access token)
 * @header  {string} Authorization - Bearer token
 * @returns {Object} Current user data
 */
router.get('/me', async (req, res) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token deletion)
 * @access  Public
 * @returns {Object} Success message
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful. Please delete tokens on client side.'
  });
});

export default router;
