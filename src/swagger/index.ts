import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import LogService from "../services/Log/Log.service";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tap Trade",
    version: "0.1.0",
    description: "API documentation for TapTrade backend services",
  },
  servers: [{ url: "/", description: "Default" }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
};

const swagger = (app: Application) => {
  const specs = swaggerJsdoc(options);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        docExpansion: "none",
        tagsSorter: (a: string, b: string) => a.localeCompare(b),
        tryItOutEnabled: true,
      },
    })
  );

  LogService.LogInfo("Swagger initialized successfully");
};

export { swagger };
