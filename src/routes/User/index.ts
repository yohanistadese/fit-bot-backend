import express from "express";
import ActionLogRoutes from "./ActionLog.routes";
import UserRoutes from "./User.routes";
import AuthRoutes from "./Auth.routes";
import UserProfileRoutes from "./UserProfile.routes";
import UserNotificationTimeRoutes from "./UserNotificationTime.routes";

const routes = () => {
  const router = express.Router();

  router.use("/auth", AuthRoutes());
  router.use("/action-logs", ActionLogRoutes());
  router.use("/users", UserRoutes());
  router.use("/user-profiles", UserProfileRoutes());
  router.use("/user-notification-times", UserNotificationTimeRoutes());

  return router;
};

export default routes;
