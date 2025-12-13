import express from "express";
import ChatTuneRoutes from "./ChatTune.routes";
import ConversationSessionRoutes from "./ConversationSessions.routes";

const routes = () => {
  const router = express.Router();

  router.use("/chat-tunes", ChatTuneRoutes());
  router.use("/conversation-sessions", ConversationSessionRoutes());

  return router;
};

export default routes;
