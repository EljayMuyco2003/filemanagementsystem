import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import fileRoutes from './routes/file.routes';
import templateRoutes from './routes/template.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'File Management Portal API'
}));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 File Management Portal API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile', 
      files: '/api/files',
      templates: '/api/templates',
      users: '/api/admin/users',
      dashboard: '/api/dashboard'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'File Management Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handler (must be last)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 File Management Portal API                          ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   API Documentation: http://localhost:${PORT}/api-docs     ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
