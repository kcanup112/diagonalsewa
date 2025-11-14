module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define('TeamMember', {
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
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 1000]
      }
    },
    qualifications: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Qualifications must be an array');
          }
        }
      }
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Certifications must be an array');
          }
        }
      }
    },
    workDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [5, 500]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'team_members',
    timestamps: true,
    indexes: [
      {
        fields: ['isActive']
      },
      {
        fields: ['displayOrder']
      }
    ]
  });

  return TeamMember;
};
