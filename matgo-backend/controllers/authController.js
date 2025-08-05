import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, sanitizeUser } from '../utils/authUtils.js';

export async function register(req, res) {
  try {
    const { firstName, lastName, email, phone, password, role, sacco, busIdentifier, busType, saccoName } = req.body;
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : req.body.fullName;

    // Validate required fields based on role
    if (!email || !phone || !password || !role || !fullName) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Please provide all required information'
      });
    }

    // Additional validation for non-passenger roles
    if (role !== 'passenger' && (!sacco || !busIdentifier || !busType || !saccoName)) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Please provide all required vehicle and sacco information'
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
        details: 'Please use a different email address'
      });
    }

    // Check if phone is already registered
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(409).json({
        error: 'Phone number already registered',
        details: 'Please use a different phone number'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file uploads
    const files = req.files || {};
    const profilePic = files.profilePic ? files.profilePic[0].filename : null;
    const busPic = files.busPic ? files.busPic[0].filename : null;
    const license = files.license ? files.license[0].filename : null;

    // Set username to email (or phone if email is missing)
    const username = email || phone;

    // Create user with appropriate approval status
    const newUser = await User.create({
      username,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      approved: role === 'passenger', // Auto-approve passengers, others need admin approval
      avatar: profilePic,
      // Additional fields for non-passenger roles
      ...(role !== 'passenger' && {
        sacco,
        busIdentifier,
        busType,
        saccoName,
        busPhoto: busPic,
        licensePhoto: license
      })
    });

    // Generate token for auto-approved users
    const authToken = role === 'passenger' ? generateToken(newUser) : null;

    // Sanitize user data
    const sanitizedUser = sanitizeUser(newUser);

    res.status(201).json({
      message: role === 'passenger' ? 
        'Registration successful' : 
        'Registration successful. Please wait for admin approval.',
      user: sanitizedUser,
      ...(authToken && { token: authToken })
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      error: 'Registration failed',
      details: err.message
    });
  }
}

export async function login(req, res) {
  try {

    let { email, phone, password } = req.body;
    console.log('Login attempt:', req.body);

    // Normalize input
    if (typeof email === 'string') email = email.trim();
    if (typeof phone === 'string') phone = phone.trim();
    if (typeof password === 'string') password = password.trim();

    // Validate input
    if ((!email || typeof email !== 'string') && (!phone || typeof phone !== 'string')) {
      console.error('Login error: Missing email or phone', req.body);
      return res.status(400).json({
        error: 'Email or phone is required',
        details: 'Please provide a valid email address or phone number'
      });
    }

    if (!password) {
      console.error('Login error: Missing password', req.body);
      return res.status(400).json({
        error: 'Password is required',
        details: 'Please provide your password'
      });
    }

    // Find user by email or phone
    const user = await User.findOne({ 
      where: email ? { email } : { phone },
      attributes: { include: ['password', 'role', 'approved'] } 
    });

    if (!user) {
      console.error('Login error: User not found for email or phone', email || phone);
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid email/phone or password'
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.error('Login error: Invalid password for user', email);
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid email or password'
      });
    }

    // Check if user is approved (except for system_admin)
    if (user.role !== 'system_admin' && !user.approved) {
      console.error('Login error: Account not approved for user', email);
      return res.status(403).json({
        error: 'Account pending approval',
        details: 'Your account is waiting for admin approval'
      });
    }

    // Generate token using utility function
    const token = generateToken(user);

    // Get sanitized user data
    const sanitizedUser = sanitizeUser(user);

    // Send success response with token and user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user: sanitizedUser
    });
  } catch (err) {
    console.error('Login error (exception):', err, req.body);
    res.status(500).json({ 
      error: 'An error occurred during login',
      details: err.message || 'Unknown error'
    });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(sanitizeUser(user));
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({
      error: 'An error occurred while fetching profile',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export async function verifyToken(req, res) {
  try {
    const authToken = req.headers.authorization?.split(' ')[1];
    if (!authToken) {
      return res.status(401).json({
        error: 'No token provided',
        details: 'Authentication token is required'
      });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'matgo_secret');
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        details: 'User not found'
      });
    }

    res.json({
      valid: true,
      user: sanitizeUser(user)
    });

  } catch (err) {
    res.status(401).json({
      error: 'Invalid token',
      details: err.message
    });
  }
}
