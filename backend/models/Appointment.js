module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['3d_design', 'full_package', 'consultation', 'repair_maintenance']]
      }
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
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']]
      }
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'medium',
      validate: {
        isIn: [['low', 'medium', 'high', 'urgent']]
      }
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
      type: DataTypes.INTEGER,
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
