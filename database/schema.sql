-- File Management Portal Database Schema
-- PostgreSQL

-- Drop existing tables if they exist
DROP TABLE IF EXISTS uploaded_files CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(100),
  department VARCHAR(100),
  position VARCHAR(255),
  office VARCHAR(255),
  contact_number VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Uploaded files table
CREATE TABLE uploaded_files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_key VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates table
CREATE TABLE templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_templates_file_type ON templates(file_type);
CREATE INDEX idx_users_email ON users(email);

-- Comments
COMMENT ON TABLE users IS 'User accounts with authentication';
COMMENT ON TABLE profiles IS 'User profile information';
COMMENT ON TABLE uploaded_files IS 'Files uploaded by users';
COMMENT ON TABLE templates IS 'Document templates available for download';
