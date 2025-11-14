# Diagonal

A full-stack construction company web application with advanced admin dashboard, booking management, and photo upload capabilities.

## Features

### 🏗️ **Core Functionality**
- **Service Booking System**: Multiple service types (3D Design, Full Package, Consultation, Repair & Maintenance)
- **Admin Dashboard**: Comprehensive management interface with real-time statistics
- **Photo Uploads**: Support for up to 3 photos per repair request
- **Status Management**: Track bookings from Pending → Confirmed → In Progress → Completed
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 **Admin Dashboard Features**
- **Booking Management**: View, edit, delete, and manage all bookings
- **Detailed View Modal**: Complete booking information with photo gallery
- **Status Updates**: Real-time status management with visual feedback
- **Message Management**: Full visibility of customer messages and requirements
- **Statistics Overview**: Dashboard with booking metrics and trends

### � **Technical Features**
- **Frontend**: React 18 with Tailwind CSS and Framer Motion animations
- **Backend**: Node.js with Express and PostgreSQL database
- **Authentication**: JWT-based admin authentication system
- **File Handling**: Image upload and storage capabilities
- **API Integration**: RESTful API with proper error handling

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Multer (File uploads)
- bcryptjs (Password hashing)

## 📁 Project Structure

```
diagonal-construction-app/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Layout/      # Navigation, Footer components
│   │   │   ├── Forms/       # Booking forms, calculators
│   │   │   └── Charts/      # Chart components
│   │   ├── pages/           # Main page components
│   │   ├── context/         # React Context for state management
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   ├── Dockerfile           # Frontend container configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── models/              # Sequelize database models
│   ├── routes/              # Express.js API routes
│   ├── utils/               # Business logic utilities
│   │   ├── costCalculator.js    # Construction cost calculation
│   │   └── ganttData.js         # Timeline generation
│   ├── db/                  # Database initialization
│   ├── uploads/             # File upload directory
│   ├── Dockerfile           # Backend container configuration
│   └── package.json         # Backend dependencies
├── docker-compose.yml       # Multi-container setup
├── .env                     # Environment variables
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running without Docker)

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diagonal-construction-app
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit the .env file with your configuration
   # The default values should work for Docker setup
   ```

3. **Build and start all services**
   ```bash
   # Build and start all containers
   docker-compose up --build

   # Or run in detached mode
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Manual Setup (Development)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb diagonal_construction
   
   # Or use PostgreSQL commands
   psql -U postgres
   CREATE DATABASE diagonal_construction;
   CREATE USER diagonal_user WITH PASSWORD 'diagonal_password_2024';
   GRANT ALL PRIVILEGES ON DATABASE diagonal_construction TO diagonal_user;
   ```

4. **Run database migrations**
   ```bash
   npm run dev
   # The server will automatically sync database models
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional Tailwind CSS dependencies**
   ```bash
   npm install @tailwindcss/forms @tailwindcss/typography
   ```

4. **Start the development server**
   ```bash
   npm start
   # Application will run on http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diagonal_construction
DB_USER=diagonal_user
DB_PASSWORD=diagonal_password_2024

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Admin Access

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change these credentials in production!

## 📊 Features

### Customer Features

1. **3D Design & Construction Booking**
   - Service selection (3D design, full package, consultation)
   - Date picker for appointment scheduling
   - Contact form with validation
   - Address input (Ward + Municipality)

2. **Cost Calculator**
   - Plinth area input
   - Quality level selection (Basic, Standard, Premium, Luxury)
   - Detailed cost breakdown with pie charts
   - Material and labor cost estimation
   - NPR currency formatting

3. **Construction Timeline**
   - Gantt chart visualization
   - Phase-wise project timeline
   - Milestone tracking
   - Resource allocation

4. **Repair & Maintenance Booking**
   - Service category selection
   - Image upload capability
   - Camera access for mobile users
   - Emergency service requests

### Admin Features

1. **Dashboard**
   - Appointment statistics
   - Service distribution charts
   - Monthly trends
   - Recent bookings overview

2. **Booking Management**
   - View all appointments
   - Filter by status, service type, date
   - Update appointment status
   - Export data as CSV

3. **Reporting**
   - Detailed appointment reports
   - Cost analysis
   - Service performance metrics

## 🔌 API Endpoints

### Booking Endpoints
- `POST /api/booking` - Create new appointment
- `GET /api/booking/:id` - Get appointment details
- `GET /api/booking/check-availability/:date` - Check date availability
- `GET /api/booking/services/list` - Get available services

### Calculator Endpoints
- `POST /api/calculator/calculate` - Full cost calculation
- `GET /api/calculator/quick-estimate/:area` - Quick estimate
- `GET /api/calculator/timeline/:area/:type` - Project timeline
- `GET /api/calculator/rates` - Current rates

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/appointments` - List appointments
- `PUT /api/admin/appointments/:id/status` - Update status
- `GET /api/admin/export/appointments` - Export CSV

## 🎨 Business Logic

### Cost Calculation

The cost calculator uses current Nepalese construction market rates:

- **Materials**: Cement, Steel, Bricks, Sand, Aggregate, Tiles, Finishing
- **Labor**: Masonry, Carpentry, Electrical, Plumbing, Painting
- **Other**: Design, Supervision, Permits, Contingency

**Base rates per sq ft in NPR:**
- Basic Quality: ~₹1,800/sq ft
- Standard Quality: ~₹2,200/sq ft 
- Premium Quality: ~₹2,800/sq ft
- Luxury Quality: ~₹3,500/sq ft

### Timeline Generation

Construction phases with estimated durations:
1. Site Preparation & Excavation (8%)
2. Foundation Work (15%)
3. Plinth & Column Construction (12%)
4. Wall Construction (18%)
5. Roof Structure (12%)
6. Electrical & Plumbing (10%)
7. Plastering & Rendering (8%)
8. Flooring & Tiling (7%)
9. Door & Window Installation (5%)
10. Painting & Final Finishing (5%)

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up --build
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Use secure JWT secret
3. Configure production database
4. Set up SSL certificates
5. Configure reverse proxy (Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Diagonal Construction**
- **Email**: info@diagonal.com
- **Phone**: 9801890011, 015201768
- **Address**: Balkumari, Lalitpur, Nepal

## 🔗 Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login
- **API Documentation**: http://localhost:5000/api/health

---

**Built with ❤️ by Diagonal Construction Team**
