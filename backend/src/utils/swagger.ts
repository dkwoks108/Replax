import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Replax API Documentation',
      version,
      description: 'API documentation for Replax e-commerce platform',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@replax.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Product: {
          type: 'object',
          required: ['name', 'description', 'price'],
          properties: {
            name: {
              type: 'string',
              example: 'iPhone 14 Pro',
            },
            description: {
              type: 'string',
              example: 'The latest iPhone with amazing features',
            },
            price: {
              type: 'number',
              example: 999.99,
            },
            comparePrice: {
              type: 'number',
              example: 1099.99,
            },
            stock: {
              type: 'number',
              example: 100,
            },
            category: {
              type: 'string',
              format: 'ObjectId',
              example: '507f1f77bcf86cd799439011',
            },
            brand: {
              type: 'string',
              format: 'ObjectId',
              example: '507f1f77bcf86cd799439012',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                example: 'https://example.com/image.jpg',
              },
            },
            specifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: {
                    type: 'string',
                    example: 'Screen Size',
                  },
                  value: {
                    type: 'string',
                    example: '6.1 inches',
                  },
                },
              },
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
                example: 'smartphone',
              },
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express): void => {
  // Swagger page
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Replax API Documentation',
  }));

  // Docs in JSON format
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Log Swagger initialization
  const port = process.env.PORT || 5000;
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
};

export default swaggerDocs;