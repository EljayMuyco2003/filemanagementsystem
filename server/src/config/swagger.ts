import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Management Portal API',
      version: '1.0.0',
      description: 'RESTful API for file management system with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@fileportal.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://filemanagementsystem.up.railway.app'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'user'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            employee_id: { type: 'string' },
            department: { type: 'string' },
            position: { type: 'string' },
            office: { type: 'string' },
            contact_number: { type: 'string' }
          }
        },
        File: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            file_name: { type: 'string' },
            file_url: { type: 'string' },
            file_size: { type: 'integer' },
            uploaded_at: { type: 'string', format: 'date-time' }
          }
        },
        Template: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            file_url: { type: 'string' },
            file_type: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
