/**
 * Debug Admin User Script
 */

const { sequelize } = require('./models');
const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

const debugAdmin = async () => {
  try {
    console.log('🔍 Debugging admin user...');
    
    // Find all admin users
    const admins = await Admin.findAll();
    console.log(`Found ${admins.length} admin users:`);
    
    for (const admin of admins) {
      console.log('Admin:', {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        isActive: admin.isActive,
        role: admin.role,
        createdAt: admin.createdAt
      });
      
      // Test password
      const testPassword = 'admin123';
      const isValid = await admin.checkPassword(testPassword);
      console.log(`Password test for ${admin.username}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      // Also test direct bcrypt
      const directTest = await bcrypt.compare(testPassword, admin.password);
      console.log(`Direct bcrypt test for ${admin.username}: ${directTest ? '✅ VALID' : '❌ INVALID'}`);
      
      console.log('Stored password hash:', admin.password.substring(0, 20) + '...');
    }
    
    // Test creating a fresh hash
    const testHash = await bcrypt.hash('admin123', 12);
    console.log('Fresh hash for admin123:', testHash.substring(0, 20) + '...');
    const testResult = await bcrypt.compare('admin123', testHash);
    console.log('Fresh hash test:', testResult ? '✅ VALID' : '❌ INVALID');
    
  } catch (error) {
    console.error('❌ Error debugging admin:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
debugAdmin();
