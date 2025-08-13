module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[0-9]{10}$/
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: true
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    serviceType: {
      type: DataTypes.ENUM('3d_design', 'full_package', 'consultation', 'repair_maintenance'),
      allowNull: false
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0] // Must be future date
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON, // Array of image paths
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    actualCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'services',
        key: 'id'
      }
    }
  }, {
    tableName: 'appointments',
    timestamps: true,
    indexes: [
      {
        fields: ['serviceType']
      },
      {
        fields: ['status']
      },
      {
        fields: ['appointmentDate']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return Appointment;
};
