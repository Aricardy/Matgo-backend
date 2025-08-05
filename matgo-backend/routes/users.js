import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// GET all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.email) user.email = req.body.email;
    if (req.body.nationalId) user.nationalId = req.body.nationalId;

    await user.save();
    res.json({ message: 'Profile updated', user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

export default router;
