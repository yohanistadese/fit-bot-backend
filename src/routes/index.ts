import { Application, Request, Response } from "express";
import { sequelize } from "../database/sequelize";
import ServerResponse from "../utilities/response/Response";

const startTime = new Date();

let routes = (app: Application) => {
  app.get("/", (req: Request, res: Response) => {
    return ServerResponse(
      req,
      res,
      200,
      {
        name: "Tap Trade API",
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
