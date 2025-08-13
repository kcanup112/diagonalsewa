const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');

// Portfolio Model (same as in routes)
const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectType: {
    type: DataTypes.ENUM('3D Design', 'Construction', '3D Design + Construction', 'Renovation', 'Interior Design'),
    allowNull: false
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  videos: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'portfolios',
  timestamps: true
});

// Sample portfolio data
const samplePortfolios = [
  {
    title: 'Modern Villa Design',
    description: 'A stunning 3-story modern villa with contemporary architecture featuring large windows, open floor plans, and sustainable materials.',
    area: '3500 sq ft',
    location: 'Kathmandu, Nepal',
    projectType: '3D Design + Construction',
    completionDate: new Date('2024-06-15'),
    images: [],
    videos: []
  },
  {
    title: 'Traditional Nepali House',
    description: 'Beautiful traditional Nepali house design with modern amenities while preserving cultural architectural elements.',
    area: '2800 sq ft',
    location: 'Bhaktapur, Nepal',
    projectType: 'Construction',
    completionDate: new Date('2024-04-20'),
    images: [],
    videos: []
  },
  {
    title: 'Luxury Apartment Complex',
    description: 'High-end apartment complex with premium finishes, modern amenities, and eco-friendly features.',
    area: '1800 sq ft per unit',
    location: 'Lalitpur, Nepal',
    projectType: '3D Design + Construction',
    completionDate: new Date('2024-08-01'),
    images: [],
    videos: []
  },
  {
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 5-story office building with modern workspace design and energy-efficient systems.',
    area: '15000 sq ft',
    location: 'Kathmandu, Nepal',
    projectType: 'Renovation',
    completionDate: new Date('2024-07-10'),
    images: [],
    videos: []
  },
  {
    title: 'Residential Interior Design',
    description: 'Complete interior design makeover for a family home focusing on comfort, functionality, and aesthetic appeal.',
    area: '2200 sq ft',
    location: 'Pokhara, Nepal',
    projectType: 'Interior Design',
    completionDate: new Date('2024-05-30'),
    images: [],
    videos: []
  }
];

// Seed function
const seedPortfolios = async () => {
  try {
    console.log('Starting portfolio seeding...');
    
    // Sync the model
    await Portfolio.sync({ force: true });
    console.log('Portfolio table synchronized');
    
    // Insert sample portfolios
    const createdPortfolios = await Portfolio.bulkCreate(samplePortfolios);
    console.log(`Successfully created ${createdPortfolios.length} portfolios:`);
    
    createdPortfolios.forEach((portfolio, index) => {
      console.log(`${index + 1}. ${portfolio.title} - ${portfolio.projectType}`);
    });
    
    console.log('\nPortfolio seeding completed successfully!');
    console.log('You can now view these portfolios in the admin dashboard and frontend.');
    
  } catch (error) {
    console.error('Error seeding portfolios:', error);
  } finally {
    await sequelize.close();
  }
};

// Run seeder
if (require.main === module) {
  seedPortfolios();
}

module.exports = { seedPortfolios, Portfolio };
