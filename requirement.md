
Residential and Commercial 3D Design Visualization

Turnkey House Construction with Cost Estimation

Repair and Maintenance Services

The app should be developed using:

Frontend: React.js (with Tailwind CSS or modern design system)

Backend: Node.js (Express.js)

Database: PostgreSQL

ORM: Sequelize

Containerization: Docker (multi-container setup using Docker Compose)
Frontend Requirements
Use React.js with the following pages/components:

1. Home Page
Introduction about services

CTA buttons: “Book Appointment”, “Calculate Cost”, “View Portfolio”

2. 3D Design & Construction Page
Sections:

What we do: Full solution from 3D design to house construction

📐 Floor Plan & 3D Design gallery

🌀 Design Process (timeline or stepper UI)

📁 Portfolio

📅 Booking form with fields:

Name, Phone, Email (optional), Address (Ward + Municipality)

Date Picker

Dropdown: Services (3D design, full package, consultation)

🧮 House Construction Cost Calculator:

Input: Plinth area (sq. ft.)

Output:

Estimated total cost (in NPR)

Pie chart for cost breakdown (materials, labor, etc.)

Gantt chart for construction timeline (start-to-end)

Use Chart.js or Recharts for visualizations

3. Repair & Maintenance Page
Service listing: Plumbing, AC install/repair, remodeling, leakage fixes, etc.

Booking Form (same format and should be able to upload image as well should be able to have direct access to camera in case of mobile view to take and upload photos))

4. Contact Page
Inquiry form

Google Maps embed

Company contact info (info@diagonal.com,Balkumari Lalitpur,015201768,9801890011

5. Admin Panel (must)
View submitted bookings

Export reports

🔧 Backend Requirements
Use Node.js + Express + PostgreSQL + Sequelize with RESTful API routes.

📁 Endpoints
POST /api/book
Accepts appointment booking

Fields: name, phone, email, address, service_type, appointment_date

Stores in PostgreSQL

POST /api/calculate
Accepts: plinth_area (number)

Returns:

Total estimated cost (area × rate)

JSON data for pie chart (percentage breakdown)

JSON data for Gantt chart (step-by-step construction plan)

🧠 Business Logic (in separate utility modules)
costCalculator.js – logic to compute total and breakdown is done on the basis of labor charge, materials like bricks,steel rods, cement, sand,pebbles,tiling flooring, finishing (search internet)

ganttData.js – logic to generate fake construction timeline (based on area)

🗃️ Tables
appointments (for booking data)

services (optional static list)

🐳 Docker + PostgreSQL
Provide full Docker support:

Dockerfile for Node.js backend

Dockerfile or simple setup for React frontend

docker-compose.yml for:

Backend (node)

Frontend (react)

PostgreSQL DB (with env secrets)
Additional Requirements
Use .env for DB credentials and configs

Backend must:

Validate input using express-validator or joi

Return proper status codes and messages

Frontend must:

Handle loading and error states

Validate form before sending

Show confirmation message on successful booking

All services must be dockerized and launch  via docker-compose up

postgres database information

also create a admin panel for viewing the booking.
