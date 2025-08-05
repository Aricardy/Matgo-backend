import SaccoAdmin from '../models/SaccoAdmin.js';
import { createUserEntry } from '../utils/userUtils.js';

export const registerSaccoAdmin = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      password,
      saccoName,
      position,
      nationalId,
      workId 
    } = req.body;

    // Create entry in Users table first
    const userEntry = await createUserEntry({
      fullName,
      email,
      phone,
      password
    }, 'sacco_admin');

    // Create the sacco admin entry
    const saccoAdmin = await SaccoAdmin.create({
      fullName,
      email,
      phone,
      password: userEntry.password,
      saccoName,
      position,
      nationalId,
      workId,
      avatar: req.file?.avatar?.path || null,
      workIdImage: req.file?.workIdImage?.path || null,
      nationalIdImage: req.file?.nationalIdImage?.path || null
    });

    res.status(201).json({
      message: 'Sacco Admin registered successfully',
      saccoAdmin
    });
  } catch (error) {
    console.error('Error registering sacco admin:', error);
    res.status(500).json({
      error: 'Failed to register sacco admin',
      details: error.message
    });
  }
};

export const getSaccoAdminProfile = async (req, res) => {
  try {
    const admin = await SaccoAdmin.findOne({ where: { id: req.params.id } });
    if (!admin) {
      return res.status(404).json({ error: 'Sacco Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error fetching sacco admin profile:', error);
    res.status(500).json({
      error: 'Failed to fetch sacco admin profile',
      details: error.message
    });
  }
};

export const updateSaccoAdminProfile = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone,
      saccoName,
      position
    } = req.body;

    const [updated] = await SaccoAdmin.update({
      fullName,
      email,
      phone,
      saccoName,
      position,
      avatar: req.file?.avatar?.path || undefined // Only update if new file provided
    }, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Sacco Admin not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating sacco admin profile:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      details: error.message
    });
  }
};
