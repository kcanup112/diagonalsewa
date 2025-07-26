/**
 * Check Bookings Script
 * Check how many bookings are in the database
 */

const { sequelize } = require('./models');
const { Appointment } = require('./models');

const checkBookings = async () => {
  try {
    // Get all bookings
    const bookings = await Appointment.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    console.log(`\n📋 Total bookings found: ${bookings.length}`);
    
    if (bookings.length > 0) {
      console.log('\n📋 Recent bookings:');
      bookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. ${booking.name}`);
        console.log(`   📞 Phone: ${booking.phone}`);
        console.log(`   📧 Email: ${booking.email || 'Not provided'}`);
        console.log(`   🏠 Address: ${booking.address}`);
        console.log(`   🔧 Service: ${booking.serviceType}`);
        console.log(`   📅 Date: ${booking.appointmentDate}`);
        console.log(`   📊 Status: ${booking.status}`);
        console.log(`   🕒 Created: ${booking.createdAt}`);
      });
    } else {
      console.log('❌ No bookings found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking bookings:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
checkBookings();
