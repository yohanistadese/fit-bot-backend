import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http, { Server } from "http";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./.env" });

import routes from "./routes";
import LogService from "./services/Log/Log.service";
import { env } from "./config";
import { initializeDatabase } from "./database/sequelize";
import ServerResponse from "./utilities/response/Response";
import { swagger } from "./swagger";

const app: Application = express();
const httpServer: Server = new http.Server(app);

// Middleware
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(
  compression({
    filter: (req: Request, res: Response) =>
      req.originalUrl.startsWith("/events")
        ? false
        : compression.filter(req, res),
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Static files
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/profiles", express.static("profiles"));
app.use("/assets", express.static("./assets"));

// View engine
app.set("view engine", "pug");
app.set("views", "./views");

// Initialize database before starting server
const startServer = async () => {
  const dbConnected = await initializeDatabase();
  if (!dbConnected) {
    LogService.LogError("Failed to connect to database. Server not started.");
    process.exit(1);
  }

  // Routes
  routes(app);

  //Swagger
  if (env.SWAGGER_ENABLED) {
    swagger(app);
  }

  // Fallback route
  app.use((req: Request, res: Response) => {
    const startTime = new Date();
    ServerResponse(
      req,
      res,
      404,
      null,
      `Endpoint '${req.url}' not found`,
      startTime
    );
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    LogService.LogError(`Unhandled Rejection at: ${promise}`);
    LogService.LogError(`Reason: ${reason}`);
  });

  // Start server
  httpServer.listen(env.PORT, () => {
    LogService.LogInfo(`Server running on port ${env.PORT}`);
  });
};

// Run server
startServer();

export { app };
