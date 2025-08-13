/**
 * Admin Initialization Script
 * Run this script to create a default admin user
 */

const { sequelize } = require('./models');
const { Admin } = require('./models');

const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Email: ${existingAdmin.email}`);
      return;
    }

    // Create default admin
    const defaultAdmin = await Admin.create({
      username: 'admin',
      email: 'admin@diagonal.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('✅ Default admin user created successfully!');
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@diagonal.com');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
createDefaultAdmin();
