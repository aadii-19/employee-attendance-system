```markdown
# Employee Attendance Management System

## 1. Project Overview

Employee Attendance Management System is a full-stack web application designed to manage and track daily attendance for organizations. The system provides secure authentication, role-based dashboards for employees and managers, attendance tracking, analytics, and reporting.

The application is built using a clean MVC backend architecture and a modular React frontend.

---

## 2. Features

### Authentication
- JWT-based login and registration
- Role-based access control (Employee / Manager)
- Secure password hashing using bcrypt
- Protected routes on frontend and backend

---

### Employee Module
- Dashboard with attendance statistics and charts
- Real-time check-in and check-out
- Attendance history with filters and pagination
- Monthly attendance calendar view
- Profile page

---

### Manager Module
- Manager dashboard with team statistics
- Employee listing with pagination
- Drill-down employee detail view
- Monthly attendance summary per employee
- CSV export of attendance records
- Absent employee drill-down

---

## 3. Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts
- React Calendar
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

---

## 4. System Architecture

The backend follows the MVC pattern:

- **Routes** → Define API endpoints
- **Controllers** → Handle request logic
- **Models** → Execute parameterized SQL queries
- **Middleware** → Authentication and role validation

The frontend follows a modular structure:

- Pages
- Components
- Hooks
- Context (Authentication + Theme)
- API Layer

Data flows from the database → model → controller → API response → frontend hook → UI components.

---

## 5. Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- full_name
- role (employee | manager)
- created_at
- updated_at

### Attendance Table
- id (Primary Key)
- user_id (Foreign Key → users.id)
- date
- check_in_time
- check_out_time
- total_hours
- status (present | late | half-day)
- notes
- created_at
- updated_at

**Constraint:**
- UNIQUE (user_id, date) — prevents duplicate check-in.

---

## 6. API Overview

**Base URL**
```
http://localhost:5000/api
```

All responses follow:

**Success**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Authentication Endpoints
- POST /auth/register
- POST /auth/login
- GET /auth/me

### Employee Endpoints
- POST /employee/check-in
- PUT /employee/check-out
- GET /employee/attendance/today
- GET /employee/attendance
- GET /employee/attendance/monthly
- GET /employee/dashboard

### Manager Endpoints
- GET /manager/dashboard
- GET /manager/employees
- GET /manager/employees/:id/monthly
- GET /manager/employees/:id/export

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 7. Setup Instructions

### Clone Repository
```bash
git clone <repository-url>
cd employee-attendance-system
```

### Backend Setup
```bash
cd backend
npm install
```

Create PostgreSQL database:
```sql
CREATE DATABASE attendance_db;
```

Run schema:
```bash
psql -U postgres -d attendance_db -f database/init.sql
```

Create `.env` file inside backend:
```ini
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/attendance_db
JWT_SECRET=your_secret_key
```

Start backend:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file inside frontend:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

---

## 8. Seed Data

Seed script is available to populate sample users and attendance records.

Run:
```bash
psql -U postgres -d attendance_db -f seed.sql
```

---

## 9. Demo Credentials

**Employee**
```
employee@example.com
password123
```

**Manager**
```
manager@example.com
password123
```

---

## 10. Folder Structure

```
root/
 ├── frontend/
 ├── backend/
 ├── seed.sql
 ├── README.md
```

### Frontend Structure
- api/
- components/
- context/
- hooks/
- layouts/
- pages/
- utils/

### Backend Structure
- routes/
- controllers/
- models/
- middleware/
- config/
- utils/

---

## 11. Screenshots

Add screenshots here:

- Login Page
- Employee Dashboard
- Monthly Calendar View
- Manager Dashboard
- Employee Detail Page

---

## 12. Future Improvements

- Password reset functionality
- Admin role
- Email notifications
- Deployment configuration
- Performance optimizations
- Advanced analytics

---

## 13. License

This project is created for evaluation and educational purposes.
```