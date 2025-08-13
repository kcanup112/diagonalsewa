/**
 * Force Reset Admin Password Script
 */

const { sequelize } = require('./models');
const { Admin } = require('./models');

const forceResetPassword = async () => {
  try {
    console.log('🔄 Force resetting admin password...');
    
    // Find the admin user
    const admin = await Admin.findOne({
      where: { username: 'admin' }
    });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('Found admin:', admin.username, admin.email);
    
    // Delete and recreate admin with correct password
    await admin.destroy();
    console.log('🗑️ Deleted existing admin');
    
    // Create new admin (this will trigger the beforeCreate hook)
    const newAdmin = await Admin.create({
      username: 'admin',
      email: 'admin@diagonal.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    
    console.log('✅ Created new admin with fresh password!');
    
    // Test the password immediately
    const testResult = await newAdmin.checkPassword('admin123');
    console.log('Password test:', testResult ? '✅ VALID' : '❌ INVALID');
    
    console.log('');
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@diagonal.com');
    
  } catch (error) {
    console.error('❌ Error force resetting admin password:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
forceResetPassword();
