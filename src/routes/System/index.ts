import express from "express";
import ConfigRoutes from "./Config.routes";
import FileRoutes from "./File.routes";
import DraftSyncRoutes from "./DraftSync.routes";

const routes = () => {
  const router = express.Router();

  router.use("/files", ConfigRoutes());
  router.use("/configs", FileRoutes());
  router.use("/draft-sync", DraftSyncRoutes());

  return router;
};

export default routes;
