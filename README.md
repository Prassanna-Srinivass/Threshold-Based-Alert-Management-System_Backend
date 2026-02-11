# Threshold-Based Alert Management System - Backend

## Overview
Backend API for the Threshold-Based Alert Management System built with Node.js, Express, and MongoDB Atlas.

## Tech Stack
- **Node.js** with Express.js
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)
- **bcrypt** (Password Hashing)

## Features
- JWT-based authentication with role-based access control
- RESTful API endpoints for ADMIN and OPERATOR roles
- Automatic alert generation when thresholds are breached
- MongoDB Atlas integration for cloud data persistence

## Database Models
- **User**: username, email, password (hashed), role (ADMIN/OPERATOR)
- **Threshold**: name, minValue, maxValue, isActive status
- **Value**: numeric value, operatorId reference, submission timestamp
- **Alert**: auto-generated on threshold breach, tracks breach type and message

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Admin Routes (Require ADMIN role)
- `POST /api/admin/thresholds` - Create threshold rule
- `GET /api/admin/thresholds` - Get all thresholds
- `PUT /api/admin/thresholds/:id` - Update threshold
- `DELETE /api/admin/thresholds/:id` - Delete threshold
- `GET /api/admin/alerts` - View all system alerts

### Operator Routes (Require OPERATOR role)
- `POST /api/operator/values` - Submit numeric value (auto-generates alerts)
- `GET /api/operator/values` - Get submitted values
- `GET /api/operator/alerts` - View personal alerts

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prassanna-Srinivass/Threshold-Based-Alert-Management-System_Backend.git
cd Threshold-Based-Alert-Management-System_Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT token generation

## Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization middleware
- Environment variable protection for sensitive data

## Author
Prassanna Srinivasan
