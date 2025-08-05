
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Update user profile
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields if provided
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.email) user.email = req.body.email;
    if (req.body.nationalId) user.nationalId = req.body.nationalId;
    if (req.file) user.avatar = req.file.filename;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

router.post('/signup', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'busPic', maxCount: 1 },
  { name: 'license', maxCount: 1 }
]), async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, role, sacco, busIdentifier, busType, saccoName } = req.body;
    const fullName = `${firstName} ${lastName}`;
    const username = email || phone; // Use email as username, fallback to phone
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get uploaded files
    const files = req.files || {};
    const profilePic = files.profilePic ? files.profilePic[0].filename : null;
    const busPic = files.busPic ? files.busPic[0].filename : null;
    const license = files.license ? files.license[0].filename : null;

    let user;
    
    if (role === 'passenger') {
      // Create user and save to passenger table
      user = await User.create({ 
        username, 
        fullName, 
        email, 
        phone, 
        role, 
        avatar: profilePic, 
        password: hashedPassword, 
        approved: true 
      });
      
      // Save to passenger table
      const Passenger = (await import('../models/Passenger.js')).default;
      await Passenger.create({ 
        userId: user.id, 
        name: fullName, 
        phone, 
        email,
        avatar: profilePic
      });
      
    } else if (role === 'sacco') {
      // Create user and save to sacco admin table
      user = await User.create({ 
        username, 
        fullName, 
        email, 
        phone, 
        role: 'sacco_admin', 
        avatar: profilePic, 
        password: hashedPassword, 
        approved: false 
      });
      
      // Save to sacco admin table
      const SaccoAdmin = (await import('../models/SaccoAdmin.js')).default;
      await SaccoAdmin.create({ 
        userId: user.id, 
        saccoName: saccoName || '', 
        approved: false,
        avatar: profilePic
      });
      
    } else if (role === 'driver') {
      // Create user and save to driver table
      user = await User.create({ 
        username, 
        fullName, 
        email, 
        phone, 
        role: 'driver', 
        avatar: profilePic, 
        password: hashedPassword, 
        approved: false 
      });
      
      // Save to driver table
      const Driver = (await import('../models/Driver.js')).default;
      await Driver.create({ 
        userId: user.id, 
        name: fullName, 
        phone, 
        email,
        sacco: sacco || '',
        busIdentifier: busIdentifier || '',
        busType: busType || '',
        avatar: profilePic,
        busPic: busPic,
        license: license
      });
      
    } else if (role === 'conductor') {
      // Create user and save to conductor table
      user = await User.create({ 
        username, 
        fullName, 
        email, 
        phone, 
        role: 'conductor', 
        avatar: profilePic, 
        password: hashedPassword, 
        approved: false 
      });
      
      // Save to conductor table
      const Conductor = (await import('../models/Conductor.js')).default;
      await Conductor.create({ 
        userId: user.id, 
        name: fullName, 
        phone, 
        email,
        sacco: sacco || '',
        busIdentifier: busIdentifier || '',
        busType: busType || '',
        avatar: profilePic,
        busPic: busPic,
        license: license
      });
      
    } else {
      // Default user creation
      user = await User.create({ 
        username, 
        fullName, 
        email, 
        phone, 
        role, 
        avatar: profilePic, 
        password: hashedPassword, 
        approved: false 
      });
    }
    
    res.status(201).json({ 
      message: 'Signup successful', 
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'matgo_secret',
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login error', details: err.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Profile error', details: err.message });
  }
});

// Admin route to approve crew (driver/conductor)
router.put('/approve/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin' && req.user.role !== 'sacco_admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can approve accounts' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.approved = true;
    await user.save();
    res.json({ message: 'User approved', user });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed', details: err.message });
  }
});

export default router;
