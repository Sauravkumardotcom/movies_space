import express from 'express';
import bcryptjs from 'bcryptjs';
import { findUserByEmail, insertUser, findUserById, updateLastLogin, getAdminByEmail } from '../db/repositories/users.js';
import { protectRoute, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';
import { validateAdminLogin, validateUserLogin } from '../middleware/validators.js';

const router = express.Router();

const PUBLIC_USER_FIELDS = [
  'id',
  'email',
  'username',
  'firstName',
  'lastName',
  'avatar',
  'bio',
  'role',
  'isVerified',
  'lastLogin',
  'isActive',
  'preferences',
  'metadata',
  'createdAt',
  'updatedAt'
];

const sanitizeUser = (user) => {
  if (!user) return null;
  const sanitized = {};
  for (const field of PUBLIC_USER_FIELDS) {
    if (field in user) sanitized[field] = user[field];
  }
  return sanitized;
};

router.post('/register', validateUserLogin, async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const savedUser = await insertUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      username: username || null,
      role: 'user'
    });

    const accessToken = generateAccessToken({ userId: savedUser.id, email: savedUser.email, role: savedUser.role });
    const refreshToken = generateRefreshToken({ userId: savedUser.id, email: savedUser.email });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: sanitizeUser(savedUser),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await updateLastLogin(user.id);

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

router.post('/refresh-token', verifyRefreshToken, async (req, res) => {
  try {
    const { userId, email } = req.user;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return res.status(200).json({ success: true, message: 'Tokens refreshed successfully', tokens: { accessToken, refreshToken } });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ success: false, message: 'Token refresh failed', error: error.message });
  }
});

router.get('/me', protectRoute, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile', error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logout successful. Please delete tokens on client side.' });
});

router.post('/admin/login', validateAdminLogin, async (req, res) => {
  try {
    const { password, email } = req.body;
    const adminEmail = email ? email.toLowerCase() : process.env.ADMIN_EMAIL?.toLowerCase();

    if (!adminEmail) {
      return res.status(400).json({ success: false, message: 'Admin email is required' });
    }

    const adminUser = await getAdminByEmail(adminEmail);

    if (adminUser) {
      const isValid = await bcryptjs.compare(password, adminUser.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      const accessToken = generateAccessToken({ userId: adminUser.id, email: adminUser.email, role: adminUser.role });
      return res.status(200).json({ success: true, message: 'Admin login successful', token: accessToken, user: sanitizeUser(adminUser) });
    }

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPasswordHash && !adminPassword) {
      return res.status(500).json({ success: false, message: 'Admin credentials are not configured' });
    }

    const valid = adminPasswordHash
      ? await bcryptjs.compare(password, adminPasswordHash)
      : password === adminPassword;

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const accessToken = generateAccessToken({ userId: null, email: adminEmail, role: 'admin' });
    return res.status(200).json({ success: true, message: 'Admin login successful', token: accessToken, user: { email: adminEmail, role: 'admin' } });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
  }
});

export default router;
