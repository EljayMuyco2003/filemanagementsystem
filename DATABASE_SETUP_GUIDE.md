# Database Setup Guide - PostgreSQL Installation

## 🚨 **IMPORTANT: You Need to Install PostgreSQL First!**

Your database tables don't exist yet because PostgreSQL isn't installed. Here's how to set it up:

---

## 📥 **Step 1: Install PostgreSQL**

### **Option A: Download PostgreSQL (Recommended)**

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Download the latest version (PostgreSQL 16)

2. **Run the Installer:**
   - Double-click the downloaded file
   - Click "Next" through the setup
   - **IMPORTANT:** Remember the password you set for the `postgres` user!
   - Default port: 5432 (keep this)
   - Install all components (PostgreSQL Server, pgAdmin, Command Line Tools)

3. **Verify Installation:**
   ```powershell
   psql --version
   ```
   Should show: `psql (PostgreSQL) 16.x`

### **Option B: Use Docker (Alternative)**

If you have Docker installed:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

---

## 🗄️ **Step 2: Create the Database**

### **Using pgAdmin (GUI - Easier):**

1. **Open pgAdmin 4** (installed with PostgreSQL)
2. **Connect to PostgreSQL:**
   - Server: localhost
   - Username: postgres
   - Password: (the one you set during installation)

3. **Create Database:**
   - Right-click "Databases"
   - Click "Create" → "Database"
   - Name: `file_portal`
   - Click "Save"

4. **Run Schema:**
   - Click on `file_portal` database
   - Click "Tools" → "Query Tool"
   - Copy the contents of `database/schema.sql`
   - Paste into Query Tool
   - Click "Execute" (▶️ button)

5. **Run Seed Data:**
   - In the same Query Tool
   - Copy the contents of `database/seed.sql`
   - Paste and Execute

### **Using Command Line (Alternative):**

```powershell
# Create database
createdb -U postgres file_portal

# Run schema
psql -U postgres -d file_portal -f database/schema.sql

# Run seed data
psql -U postgres -d file_portal -f database/seed.sql
```

---

## ⚙️ **Step 3: Configure Backend Environment**

Create or update `server/.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/file_portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:4200
```

**Replace `YOUR_PASSWORD` with your PostgreSQL password!**

---

## ✅ **Step 4: Verify Database Setup**

### **Check Tables Exist:**

**Using pgAdmin:**
1. Expand `file_portal` database
2. Expand "Schemas" → "public" → "Tables"
3. You should see:
   - ✅ users
   - ✅ profiles
   - ✅ uploaded_files
   - ✅ templates

**Using Command Line:**
```powershell
psql -U postgres -d file_portal -c "\dt"
```

Should show:
```
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | profiles        | table | postgres
 public | templates       | table | postgres
 public | uploaded_files  | table | postgres
 public | users           | table | postgres
```

### **Check Seed Data:**

```powershell
psql -U postgres -d file_portal -c "SELECT email, role FROM users;"
```

Should show:
```
       email        | role
--------------------+-------
 admin@portal.com   | admin
 user@portal.com    | user
```

---

## 🚀 **Step 5: Start Your Application**

Now you can start both servers:

### **Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

Should see:
```
╔═══════════════════════════════════════════════════════════╗
║   🚀 File Management Portal API                          ║
║   Server running on: http://localhost:3000              ║
╚═══════════════════════════════════════════════════════════╝
```

### **Terminal 2 - Frontend:**
```bash
cd client
npm install
npm start
```

Should see:
```
** Angular Live Development Server is listening on localhost:4200 **
```

### **Test the Application:**
1. Open browser: http://localhost:4200
2. Login with:
   - **Admin:** admin@portal.com / Admin@1234
   - **User:** user@portal.com / User@1234

---

## 🔧 **Troubleshooting**

### **Problem: "psql: command not found"**
**Solution:** Add PostgreSQL to PATH:
1. Find PostgreSQL bin folder: `C:\Program Files\PostgreSQL\16\bin`
2. Add to System PATH environment variable
3. Restart terminal

### **Problem: "password authentication failed"**
**Solution:** Check your password in `.env` file matches PostgreSQL password

### **Problem: "database does not exist"**
**Solution:** Create the database first:
```powershell
createdb -U postgres file_portal
```

### **Problem: "connection refused"**
**Solution:** Make sure PostgreSQL service is running:
- Open Services (Windows + R → `services.msc`)
- Find "postgresql-x64-16"
- Make sure it's "Running"

---

## 📊 **Database Schema Overview**

Your database has 4 tables:

### **1. users**
- Stores user accounts
- Fields: id, email, password_hash, role, created_at

### **2. profiles**
- Stores user profile information
- Fields: id, user_id, first_name, last_name, employee_id, department, etc.

### **3. uploaded_files**
- Stores file metadata
- Fields: id, user_id, file_name, file_url, file_size, uploaded_at

### **4. templates**
- Stores document templates
- Fields: id, name, description, file_url, file_type, created_at

---

## 🎯 **Quick Setup Summary**

1. ✅ **Install PostgreSQL** (https://www.postgresql.org/download/windows/)
2. ✅ **Create database:** `file_portal`
3. ✅ **Run schema:** `database/schema.sql`
4. ✅ **Run seed data:** `database/seed.sql`
5. ✅ **Configure `.env`** with your PostgreSQL password
6. ✅ **Start backend:** `cd server && npm run dev`
7. ✅ **Start frontend:** `cd client && npm start`
8. ✅ **Test:** http://localhost:4200

---

## 🆘 **Need Help?**

If you get stuck:
1. Check PostgreSQL is running (Services)
2. Verify password in `.env` matches PostgreSQL password
3. Make sure database `file_portal` exists
4. Check tables were created successfully

---

## 📝 **Alternative: Use Supabase (No Installation)**

If you don't want to install PostgreSQL locally, you can use Supabase:

1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Get connection string
5. Run schema in Supabase SQL Editor
6. Update `.env` with Supabase connection string

**But I recommend installing PostgreSQL locally for learning!**