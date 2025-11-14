const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite Configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database', 'diagonal_construction.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  // Enable foreign keys in SQLite
  dialectOptions: {
    // Foreign keys are disabled by default in SQLite
    foreignKeys: true
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Appointment = require('./Appointment')(sequelize, Sequelize);
db.Service = require('./Service')(sequelize, Sequelize);
db.Admin = require('./Admin')(sequelize, Sequelize);
db.TeamMember = require('./TeamMember')(sequelize, Sequelize);
db.Offer = require('./Offer')(sequelize, Sequelize);

// Define associations
db.Appointment.belongsTo(db.Service, { foreignKey: 'serviceId', as: 'service' });
db.Service.hasMany(db.Appointment, { foreignKey: 'serviceId', as: 'appointments' });

// Offer associations
db.Offer.belongsToMany(db.Service, { 
  through: 'OfferServices', 
  foreignKey: 'offerId', 
  otherKey: 'serviceId',
  as: 'services' 
});
db.Service.belongsToMany(db.Offer, { 
  through: 'OfferServices', 
  foreignKey: 'serviceId', 
  otherKey: 'offerId',
  as: 'offers' 
});

module.exports = db;
