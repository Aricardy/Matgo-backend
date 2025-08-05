import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createUserEntry = async (userData, role) => {
  try {
    const { fullName, email, phone, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create entry in Users table
    const user = await User.create({
      username: email, // Using email as username
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      approved: role === 'passenger' // Auto-approve passengers, others need admin approval
    });

    return user;
  } catch (error) {
    console.error('Error creating user entry:', error);
    throw error;
  }
};
