const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'diagonal_construction',
  process.env.DB_USER || 'diagonal_user',
  process.env.DB_PASSWORD || 'diagonal_password_2024',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

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
