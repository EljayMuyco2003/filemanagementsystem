# File Management Portal

A full-stack file management system built with **Angular 17** and **Express + TypeScript**.

## 🚀 Tech Stack

### Frontend
- **Angular 17** (Standalone Components)
- **Tailwind CSS** (Spotify Dark Theme)
- **RxJS** for reactive programming
- **TypeScript**

### Backend
- **Node.js + Express**
- **TypeScript**
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **Swagger/OpenAPI** documentation

## 📁 Project Structure

```
file-management-portal/
├── client/                 # Angular 17 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── guards/    # Auth & Role guards
│   │   │   ├── interceptors/
│   │   │   ├── models/    # TypeScript interfaces
│   │   │   ├── pages/     # 6 page components
│   │   │   └── services/  # API services
│   │   └── styles.css     # Spotify theme
│   └── package.json
│
├── server/                 # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/        # Database, JWT, Swagger
│   │   ├── controllers/   # 6 controllers
│   │   ├── middleware/    # Auth, CORS, error handling
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── app.ts
│   └── package.json
│
├── database/               # PostgreSQL schema
│   ├── schema.sql
│   └── seed.sql
│
├── START_BACKEND.bat       # Windows: Start Express server
├── START_FRONTEND.bat      # Windows: Start Angular app
└── SETUP_DATABASE.bat      # Windows: Setup PostgreSQL
```

## 🎯 Features

### User Features
- ✅ Login/Logout with JWT authentication
- ✅ View personal dashboard with statistics
- ✅ Update profile information
- ✅ Upload files (drag-and-drop)
- ✅ View and delete own files
- ✅ Browse available templates

### Admin Features
- ✅ All user features
- ✅ View all users' activity on dashboard
- ✅ Create and delete templates
- ✅ Create and delete user accounts
- ✅ Assign user roles (admin/user)

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### 1. Setup Database

#### Option A: Using the Batch Script (Windows)
```bash
SETUP_DATABASE.bat
```

#### Option B: Manual Setup
```bash
# Create database
createdb file_portal

# Run schema
psql -U postgres -d file_portal -f database/schema.sql

# Seed data
psql -U postgres -d file_portal -f database/seed.sql
```

### 2. Configure Environment Variables

Create `.env` file in the `server/` directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/file_portal

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

### 3. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## 🚀 Running the Application

### Option A: Using Batch Scripts (Windows)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
START_BACKEND.bat
```

**Terminal 2 - Frontend:**
```bash
START_FRONTEND.bat
```

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

### Default Login Credentials

**Admin Account:**
- Email: `admin@portal.com`
- Password: `Admin@1234`

**User Account:**
- Email: `user@portal.com`
- Password: `User@1234`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Files
- `GET /api/files` - Get all files
- `POST /api/files` - Upload file
- `DELETE /api/files/:id` - Delete file

### Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template (admin)
- `DELETE /api/templates/:id` - Delete template (admin)

### Admin - Users
- `GET /api/admin/users` - Get all users (admin)
- `POST /api/admin/users` - Create user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 Design System

The application uses a **Spotify-inspired dark theme**:

- Background: `#121212`
- Cards: `#181818`
- Accent: `#1ed760` (Spotify Green)
- Text: `#ffffff` / `#b3b3b3`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- HTTP-only cookies
- CORS protection
- Input validation and sanitization
- SQL injection prevention

## 📦 Build for Production

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
```

The production build will be in `client/dist/`.

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📖 Documentation

- `ANGULAR_SETUP_COMPLETE.md` - Angular frontend details
- `BACKEND_COMPLETE.md` - Express backend details
- `COMPLIANCE_CHECKLIST.md` - School requirements compliance
- `HOW_TO_RUN.md` - Detailed running instructions
- `CONVERSION_STATUS.md` - Project conversion status

## 🤝 Contributing

This is a school project. Contributions are not currently accepted.

## 📄 License

MIT License

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Team
- Express.js Team
- PostgreSQL Community
- Tailwind CSS Team

---

**Note**: This project was converted from Next.js to Angular + Express to meet specific school requirements for full-stack web development.
