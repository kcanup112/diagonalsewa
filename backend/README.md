# Diagonal Construction Backend API

## Overview
REST API for the Diagonal Construction company website providing cost calculation, appointment booking, and admin functionality.

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Environment Variables
```
PORT=5000
NODE_ENV=development
DB_NAME=diagonal_construction
DB_USER=diagonal_user
DB_PASSWORD=diagonal_password_2024
DB_HOST=localhost
DB_PORT=5432
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Calculator API
```
POST /api/calculator/calculate
```
Calculate construction cost and timeline.

**Request Body:**
```json
{
  "plinth_area": 2000,
  "floors": 2,
  "quality": "standard",
  "project_type": "residential"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cost calculation completed successfully",
  "data": {
    "costEstimation": {
      "totalCost": 3630000,
      "ratePerSqFt": 1815,
      "pieChartData": [...],
      "breakdown": {...}
    },
    "timeline": {
      "projectInfo": {...},
      "phases": [...]
    }
  }
}
```

### Booking API
```
POST /api/booking/appointment
GET /api/booking/appointments
PUT /api/booking/appointment/:id
DELETE /api/booking/appointment/:id
```

### Admin API
```
POST /api/admin/login
GET /api/admin/dashboard
```

## Database Models

### Appointment
- id, name, email, phone, service_id, preferred_date, message, status, created_at, updated_at

### Service
- id, name, description, price_range, duration, created_at, updated_at

### Admin
- id, username, email, password_hash, role, created_at, updated_at

## Testing
```bash
npm test
```

## Docker Support
```bash
docker build -t diagonal-backend .
docker run -p 5000:5000 diagonal-backend
```
