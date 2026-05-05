import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter for allowed types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /docx|xlsx|pptx|pdf|doc|xls|ppt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /application\/(vnd\.openxmlformats-officedocument|msword|vnd\.ms-|pdf)/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (DOCX, XLSX, PPTX, PDF)'));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '33554432') // 32MB default
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large', 
        message: 'File size must be less than 32MB' 
      });
    }
    return res.status(400).json({ 
      error: 'Upload error', 
      message: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      error: 'Upload error', 
      message: err.message 
    });
  }
  next();
};
