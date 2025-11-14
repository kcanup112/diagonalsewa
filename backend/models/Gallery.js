const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Gallery = sequelize.define('Gallery', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Interior',
      validate: {
        isIn: [['Interior', 'Exterior', 'Commercial', 'Residential', 'Other']]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'gallery',
      validate: {
        isIn: [['slideshow', 'gallery']]
      }
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'Galleries',
    timestamps: true,
    indexes: [
      {
        fields: ['type']
      },
      {
        fields: ['category']
      },
      {
        fields: ['featured']
      },
      {
        fields: ['position']
      }
    ]
  });

  return Gallery;
};
