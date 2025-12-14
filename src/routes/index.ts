import { Application, Request, Response } from "express";
import { sequelize } from "../database/sequelize";
import ServerResponse from "../utilities/response/Response";

const startTime = new Date();

import UserRoutes from "./User";
import SystemRoutes from "./System";
import ChatRoutes from "./Chat";
import FitnessRoutes from "./Fitness";

let routes = (app: Application) => {
  app.use(UserRoutes());
  app.use(SystemRoutes());
  app.use(ChatRoutes());
  app.use(FitnessRoutes());

  app.get("/", (req: Request, res: Response) => {
    return ServerResponse(
      req,
      res,
      200,
      {
        name: "Fit Bot API",
        version: "1.0.0",
      },
      "Success",
      startTime
    );
  });

  app.get("/health", async (req: Request, res: Response) => {
    try {
      await sequelize.authenticate();

      return ServerResponse(
        req,
        res,
        200,
        {
          server: "OK",
          database: "OK",
          uptime: process.uptime(),
          timestamp: new Date(),
        },
        "System healthy",
        startTime
      );
    } catch (error) {
      return ServerResponse(
        req,
        res,
        500,
        {
          server: "OK",
          database: "ERROR",
          uptime: process.uptime(),
          timestamp: new Date(),
        },
        "Database connection failed",
        startTime
      );
    }
  });
};

export default routes;
