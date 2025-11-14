module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['design', 'construction', 'repair', 'consultation']]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    priceUnit: {
      type: DataTypes.STRING, // 'per_sqft', 'per_hour', 'fixed', etc.
      defaultValue: 'fixed'
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in days
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    requiresImages: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'services',
    timestamps: true
  });

  return Service;
};
