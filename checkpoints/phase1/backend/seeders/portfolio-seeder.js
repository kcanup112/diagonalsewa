const mongoose = require('mongoose');
require('dotenv').config();

// Portfolio Schema (same as in routes/portfolios.js)
const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    required: true,
    enum: ['3D Design', 'Construction', '3D Design + Construction', 'Renovation', 'Interior Design']
  },
  completionDate: {
    type: Date
  },
  images: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

const samplePortfolios = [
  {
    title: "Modern Villa Design - Kathmandu",
    description: "A stunning 3-story modern villa with contemporary architectural elements, spacious rooms, and beautiful landscaping. Features include a rooftop garden, home theater, and smart home automation.",
    area: "3500 sq ft",
    location: "Kathmandu, Nepal",
    projectType: "3D Design + Construction",
    completionDate: new Date('2024-06-15'),
    images: [], // Add actual image filenames when you upload
    videos: []  // Add actual video filenames when you upload
  },
  {
    title: "Traditional House Renovation - Bhaktapur",
    description: "Complete renovation of a traditional Newari house while preserving its cultural heritage. Modern amenities integrated seamlessly with traditional architecture.",
    area: "2800 sq ft",
    location: "Bhaktapur, Nepal",
    projectType: "Renovation",
    completionDate: new Date('2024-08-20'),
    images: [],
    videos: []
  },
  {
    title: "Luxury Apartment Interior Design",
    description: "High-end interior design for a luxury apartment featuring premium materials, custom furniture, and sophisticated lighting design.",
    area: "1800 sq ft",
    location: "Lalitpur, Nepal",
    projectType: "Interior Design",
    completionDate: new Date('2024-07-10'),
    images: [],
    videos: []
  },
  {
    title: "Commercial Building - 3D Visualization",
    description: "Detailed 3D architectural visualization for a 5-story commercial building with ground floor shops and office spaces above.",
    area: "15000 sq ft",
    location: "Pokhara, Nepal",
    projectType: "3D Design",
    completionDate: new Date('2024-05-25'),
    images: [],
    videos: []
  },
  {
    title: "Family Home Construction - Chitwan",
    description: "Complete construction of a family home with modern amenities, earthquake-resistant design, and energy-efficient features.",
    area: "2200 sq ft",
    location: "Chitwan, Nepal",
    projectType: "Construction",
    completionDate: new Date('2024-09-30'),
    images: [],
    videos: []
  }
];

async function seedPortfolios() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diagonal_construction');
    console.log('Connected to MongoDB');

    // Clear existing portfolios
    await Portfolio.deleteMany({});
    console.log('Cleared existing portfolios');

    // Insert sample portfolios
    const insertedPortfolios = await Portfolio.insertMany(samplePortfolios);
    console.log(`Inserted ${insertedPortfolios.length} sample portfolios`);

    // Display the inserted portfolios
    console.log('\nInserted portfolios:');
    insertedPortfolios.forEach((portfolio, index) => {
      console.log(`${index + 1}. ${portfolio.title} - ${portfolio.projectType}`);
    });

    console.log('\n✅ Portfolio seeding completed successfully!');
    console.log('\nNote: To complete the setup:');
    console.log('1. Upload actual images and videos through the admin panel');
    console.log('2. Update the portfolio entries with media files');
    console.log('3. Test the portfolio display on the frontend');

  } catch (error) {
    console.error('Error seeding portfolios:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedPortfolios();
}

module.exports = { seedPortfolios, Portfolio };
