import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';

// Database connection
const sequelize = new Sequelize('matgo_db', 'allan', 'Ariam@12345', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
});

// Define the User model
const User = sequelize.define('User', {
  username: { type: Sequelize.STRING, unique: true, allowNull: false },
  fullName: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, unique: true, allowNull: false },
  phone: { type: Sequelize.STRING, allowNull: false },
  role: { 
    type: Sequelize.ENUM('passenger', 'driver', 'conductor', 'sacco_admin', 'system_admin'),
    allowNull: false
  },
  avatar: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING, allowNull: false },
  approved: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false }
}, {
  tableName: 'Users'
});

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@12345', salt);
    
    // Create the admin user
    const adminUser = await User.create({
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@matgo.co.ke',
      phone: '254712345678',
      role: 'system_admin',
      password: hashedPassword,
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully:', adminUser.toJSON());
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();
