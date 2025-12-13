import express from "express";
import configRoutes from "./Config.routes";
import fileRoutes from "./File.routes";
import draftSyncRoutes from "./DraftSync.routes";

const routes = () => {
  const router = express.Router();

  router.use("/files", fileRoutes());
  router.use("/configs", configRoutes());
  router.use("/draft-sync", draftSyncRoutes());

  return router;
};

export default routes;
