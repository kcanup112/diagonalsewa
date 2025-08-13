-- Database initialization script for Diagonal Construction App
-- This script will be run when the PostgreSQL container starts

-- Create database if not exists (handled by Docker environment variables)

-- Insert default services
INSERT INTO services (id, name, category, description, "basePrice", "priceUnit", "estimatedDuration", "isActive", "requiresImages", icon, "createdAt", "updatedAt") VALUES
(
  gen_random_uuid(),
  '3D Design & Visualization',
  'design',
  'Complete 3D architectural design and visualization of your dream home',
  50.00,
  'per_sqft',
  7,
  true,
  false,
  '🏗️',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Full House Construction Package',
  'construction',
  'Complete turnkey house construction from foundation to finishing',
  2200.00,
  'per_sqft',
  120,
  true,
  false,
  '🏠',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Construction Consultation',
  'consultation',
  'Professional consultation for your construction project',
  150.00,
  'per_hour',
  1,
  true,
  false,
  '💼',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Plumbing Services',
  'repair',
  'Complete plumbing installation, repair, and maintenance services',
  80.00,
  'per_hour',
  1,
  true,
  true,
  '🔧',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'AC Installation & Repair',
  'repair',
  'Air conditioning installation, repair, and maintenance services',
  120.00,
  'per_hour',
  1,
  true,
  true,
  '❄️',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Home Remodeling',
  'repair',
  'Interior and exterior remodeling and renovation services',
  100.00,
  'per_hour',
  14,
  true,
  true,
  '🔨',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Leakage & Waterproofing',
  'repair',
  'Professional leakage detection and waterproofing solutions',
  90.00,
  'per_hour',
  2,
  true,
  true,
  '💧',
  NOW(),
  NOW()
);

-- Insert default admin user (password: admin123)
-- Note: In production, this should be changed immediately
INSERT INTO admins (id, username, email, password, role, "isActive", "createdAt", "updatedAt") VALUES
(
  gen_random_uuid(),
  'admin',
  'admin@diagonal.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBRnbzJkz/.7xm', -- hashed 'admin123'
  'admin',
  true,
  NOW(),
  NOW()
);

-- Insert sample appointments for testing (optional)
INSERT INTO appointments (id, name, phone, email, address, "serviceType", "appointmentDate", message, status, "createdAt", "updatedAt") VALUES
(
  gen_random_uuid(),
  'John Doe',
  '9841234567',
  'john@example.com',
  'Ward 5, Balkumari, Lalitpur',
  '3d_design',
  '2024-08-15 10:00:00',
  'Looking for 3D design for a 2000 sq ft house',
  'pending',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Jane Smith',
  '9851234568',
  'jane@example.com',
  'Ward 12, Pulchowk, Lalitpur',
  'full_package',
  '2024-08-20 14:00:00',
  'Complete house construction project - 1800 sq ft',
  'confirmed',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Ram Sharma',
  '9861234569',
  null,
  'Ward 8, Jawalakhel, Lalitpur',
  'repair_maintenance',
  '2024-08-18 11:00:00',
  'AC repair needed urgently',
  'pending',
  NOW(),
  NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_service_type ON appointments("serviceType");
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments("appointmentDate");
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments("createdAt");
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services("isActive");

-- Grant necessary permissions
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO diagonal_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO diagonal_user;
