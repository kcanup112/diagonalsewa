/**
 * Reset Admin Password Script
 */

const { sequelize } = require('./models');
const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

const resetAdminPassword = async () => {
  try {
    console.log('🔄 Resetting admin password...');
    
    // Find the admin user
    const admin = await Admin.findOne({
      where: { username: 'admin' }
    });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      // Create new admin
      const newAdmin = await Admin.create({
        username: 'admin',
        email: 'admin@diagonal.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ New admin user created!');
      console.log('Username: admin');
      console.log('Password: admin123');
      return;
    }
    
    // Reset password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await admin.update({ 
      password: hashedPassword,
      isActive: true 
    });
    
    console.log('✅ Admin password reset successfully!');
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email:', admin.email);
    console.log('Active:', admin.isActive);
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
resetAdminPassword();
