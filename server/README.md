# File Management Portal - Backend API

Express + TypeScript backend for the File Management Portal.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/file_management_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
MAX_FILE_SIZE=33554432
UPLOAD_DIR=uploads/
```

### 3. Set Up PostgreSQL Database

```bash
# Create database
createdb file_management_db

# Run schema
psql -d file_management_db -f ../database/schema.sql

# Generate password hashes
node generate-hash.js

# Update database/seed.sql with generated hashes, then run:
psql -d file_management_db -f ../database/seed.sql
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update user profile

### Files
- `GET /api/files` - Get user's files
- `GET /api/files/:id` - Get file by ID
- `POST /api/files` - Upload file
- `DELETE /api/files/:id` - Delete file

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create template (Admin only)
- `DELETE /api/templates/:id` - Delete template (Admin only)

### Admin - User Management
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/users/:id` - Get user by ID (Admin only)
- `POST /api/admin/users` - Create user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # PostgreSQL connection
│   │   ├── jwt.ts       # JWT utilities
│   │   └── swagger.ts   # API documentation
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── app.ts           # Express app setup
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🧪 Testing with Postman

1. Import the Swagger spec into Postman
2. Create an environment with `baseUrl = http://localhost:3000`
3. Test endpoints:

### Login
```json
POST /api/auth/login
{
  "email": "admin@portal.com",
  "password": "Admin@1234"
}
```

### Upload File
```
POST /api/files
Headers: Authorization: Bearer <token>
Body: form-data
  - file: <select file>
```

## 🛠️ Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `node generate-hash.js` - Generate password hashes

## 📝 Default Credentials

After running seed.sql:

- **Admin**: admin@portal.com / Admin@1234
- **User**: user@portal.com / User@1234

## 🔧 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `psql -l`

### Port Already in Use
- Change PORT in .env
- Kill process: `lsof -ti:3000 | xargs kill`

### File Upload Error
- Check uploads/ directory exists
- Verify MAX_FILE_SIZE in .env
- Check file type is allowed (DOCX, XLSX, PPTX, PDF)

## 🚀 Deployment

### Railway

1. Create new project on Railway
2. Add PostgreSQL database
3. Set environment variables
4. Connect GitHub repository
5. Deploy

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=<railway_postgres_url>
JWT_SECRET=<strong_secret_key>
FRONTEND_URL=<your_angular_app_url>
```

## 📄 License

MIT
