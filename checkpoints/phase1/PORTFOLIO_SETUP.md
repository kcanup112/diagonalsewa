# Portfolio Management System - Setup Guide

This document provides complete setup instructions for the dynamic portfolio management system.

## 🚀 Features Implemented

### Admin Side (Portfolio Manager)
- ✅ Create new portfolio entries
- ✅ Upload multiple images and videos
- ✅ Edit existing portfolios
- ✅ Delete portfolios with confirmation
- ✅ Preview media files before upload
- ✅ Form validation and error handling
- ✅ Responsive design

### Frontend Display
- ✅ Dynamic portfolio grid layout
- ✅ Click to open detailed popup
- ✅ Image and video slideshow
- ✅ Keyboard navigation (ESC, arrows, F, spacebar)
- ✅ Fullscreen mode
- ✅ Dark overlay with blur effect
- ✅ Mobile responsive design
- ✅ Loading states and error handling

### Backend API
- ✅ RESTful portfolio endpoints
- ✅ File upload with multer
- ✅ PostgreSQL/Sequelize integration
- ✅ Image and video storage
- ✅ CRUD operations
- ✅ File cleanup on deletion

## 📦 Installation Steps

### 1. Backend Setup

```bash
cd backend

# Dependencies already installed (multer included)
# Create uploads directory (already created)
# public/uploads/portfolios/ directory is ready

# Database is already configured with PostgreSQL
```

### 2. Frontend Dependencies
No additional dependencies needed - all components use existing libraries.

### 3. Database Setup

```bash
# Run the portfolio seeder
node seeders/portfolio-seeder-sequelize.js
```

### 4. File Structure Created

```
backend/
├── routes/portfolios.js                      # Portfolio API routes (PostgreSQL/Sequelize)
├── seeders/portfolio-seeder-sequelize.js    # Sample data seeder
└── public/uploads/portfolios/               # File storage directory

frontend/
├── components/
│   ├── admin/PortfolioManager.js            # Admin portfolio management (correct path)
│   └── Portfolio/PortfolioDisplay.js        # Frontend portfolio display
├── pages/AdminDashboard.js                  # Updated with portfolio tab
├── pages/DesignConstruction.js              # Updated portfolio section
└── styles/portfolio.css                     # Portfolio-specific styles
```

## 🎯 Usage Instructions

### For Admin Users

1. **Access Portfolio Manager**
   - Go to Admin Dashboard
   - Click on "Portfolio" tab

2. **Add New Portfolio**
   - Click "Add Portfolio" button
   - Fill in all required fields:
     - Project Title *
     - Description *
     - Area * (e.g., "2500 sq ft")
     - Location * (e.g., "Kathmandu, Nepal")
     - Project Type * (dropdown)
     - Completion Date (optional)
   - Upload images/videos (max 20 files, 50MB total)
   - Click "Save"

3. **Edit Portfolio**
   - Click edit icon on any portfolio card
   - Modify fields as needed
   - Add more media files
   - Click "Update"

4. **Delete Portfolio**
   - Click delete icon
   - Confirm deletion
   - All associated files are automatically removed

### For Website Visitors

1. **View Portfolios**
   - Go to "3D Design & Construction" page
   - Click "Portfolio" tab
   - Browse portfolio grid

2. **View Portfolio Details**
   - Click on any portfolio card
   - Use keyboard shortcuts:
     - `ESC` - Close popup
     - `←` `→` - Navigate media
     - `F` - Toggle fullscreen
     - `Space` - Play/pause videos
   - Click outside popup area to close

## 🔧 Technical Implementation

### Database Schema (PostgreSQL)
```sql
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  area VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  projectType VARCHAR(50) NOT NULL CHECK (projectType IN ('3D Design', 'Construction', '3D Design + Construction', 'Renovation', 'Interior Design')),
  completionDate DATE,
  images JSON DEFAULT '[]',
  videos JSON DEFAULT '[]',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
GET    /api/portfolios      # Get all portfolios
GET    /api/portfolios/:id  # Get single portfolio
POST   /api/portfolios      # Create portfolio (with files)
PUT    /api/portfolios/:id  # Update portfolio (with files)
DELETE /api/portfolios/:id  # Delete portfolio
DELETE /api/portfolios/:id/media # Delete specific media files
```

### File Upload Configuration
- **Storage**: Local filesystem (`/public/uploads/portfolios/`)
- **Size Limit**: 50MB per upload
- **File Limit**: 20 files maximum
- **Formats**: 
  - Images: JPEG, JPG, PNG, GIF
  - Videos: MP4, MOV, AVI, WMV

### Security Features
- File type validation
- File size limits
- Unique filename generation
- Error handling with cleanup
- Rate limiting (inherited from main app)

## 🎨 Styling and UX

### Animations & Transitions
- Smooth fade-in animations
- Hover effects on cards
- Loading spinners
- Scale animations on interactions
- Blur backdrop effects

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly controls
- Optimized modal sizes

### Keyboard Accessibility
- Full keyboard navigation
- Screen reader friendly
- Focus management
- Escape key handling

## 🚨 Important Notes

### File Storage
- Files are stored in `/backend/public/uploads/portfolios/`
- Ensure this directory has write permissions
- Consider using cloud storage (AWS S3, Cloudinary) for production

### Database Connection
- Using existing PostgreSQL database with Sequelize ORM
- No additional database setup required
- Run seeder script to add sample data

### Production Considerations
- Implement image compression
- Add CDN for file serving
- Set up automated backups
- Monitor storage usage
- Add image optimization

## 🔮 Future Enhancements

### Planned Features
- [ ] Drag-and-drop media reordering
- [ ] Bulk portfolio operations
- [ ] Advanced filtering and search
- [ ] Portfolio categories/tags
- [ ] Client testimonials integration
- [ ] Social media sharing
- [ ] Print-friendly layouts
- [ ] Analytics and view tracking

### Technical Improvements
- [ ] Image compression and optimization
- [ ] Video thumbnails generation
- [ ] Progressive image loading
- [ ] Infinite scroll for large portfolios
- [ ] Caching and performance optimization

## 📞 Support

For any issues or questions:
1. Check the console logs for errors
2. Verify file permissions in uploads directory
3. Ensure MongoDB connection is active
4. Test API endpoints manually
5. Check browser developer tools for frontend issues

The portfolio system is now fully functional and ready for use! 🎉
