import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Replax API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

// use the options so the variable is not unused
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;