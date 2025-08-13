module.exports = (sequelize, DataTypes) => {
const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  offerType: {
    type: DataTypes.ENUM('discount', 'promotion', 'special_deal', 'seasonal'),
    allowNull: false,
    defaultValue: 'discount'
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed_amount', 'buy_one_get_one', 'free_service'),
    allowNull: true
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  minimumOrderValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  maxDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  promoCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    validate: {
      isAlphanumeric: true,
      len: [3, 50]
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: function(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  showAsPopup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  popupDisplayType: {
    type: DataTypes.ENUM('immediate', 'exit_intent', 'time_delay', 'scroll_percentage'),
    allowNull: true,
    defaultValue: 'immediate'
  },
  popupDelay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Delay in seconds for time_delay type'
  },
  scrollPercentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 50,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Scroll percentage to trigger popup'
  },
  maxDisplaysPerUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      min: 1
    }
  },
  targetAudience: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of target audience criteria'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of image URLs'
  },
  videos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of video URLs'
  },
  buttonText: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Claim Offer'
  },
  buttonColor: {
    type: DataTypes.STRING(7),
    allowNull: false,
    defaultValue: '#f97316',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  backgroundColor: {
    type: DataTypes.STRING(7),
    allowNull: false,
    defaultValue: '#ffffff',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  textColor: {
    type: DataTypes.STRING(7),
    allowNull: false,
    defaultValue: '#1e293b',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Higher number = higher priority'
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Total number of times this offer can be used'
  },
  usageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  applicableServices: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of service IDs this offer applies to'
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Terms and conditions'
  }
}, {
  tableName: 'offers',
  timestamps: true,
  indexes: [
    {
      fields: ['isActive']
    },
    {
      fields: ['showAsPopup']
    },
    {
      fields: ['startDate', 'endDate']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['promoCode'],
      unique: true
    }
  ]
});

  return Offer;
};
