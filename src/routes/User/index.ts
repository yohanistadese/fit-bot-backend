import express from "express";
import actionLogRoutes from "./ActionLog.routes";
import userRoutes from "./User.routes";
import userProfileRoutes from "./UserProfile.routes";
import UserNotificationTimeRoutes from "./UserNotificationTime.routes";

const routes = () => {
  const router = express.Router();

  router.use("/action-logs", actionLogRoutes());
  router.use("/users", userRoutes());
  router.use("/user-profiles", userProfileRoutes());
  router.use("/user-notification-times", UserNotificationTimeRoutes());

  return router;
};

export default routes;
