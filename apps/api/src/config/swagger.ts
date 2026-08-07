import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ClosetIQ API",
      version: "0.1.0",
      description: "API documentation for the ClosetIQ backend",
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Local development server",
      },
      // You can add production servers here later
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.{ts,js}")], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
