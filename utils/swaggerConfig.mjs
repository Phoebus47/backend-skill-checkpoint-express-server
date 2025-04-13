import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quora Mock API",
      version: "1.0.0",
      description: "API documentation for Quora Mock project",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
    ],
  },
  apis: ["./routers/*.mjs"], // ระบุไฟล์ที่มีการเขียน Swagger Comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;