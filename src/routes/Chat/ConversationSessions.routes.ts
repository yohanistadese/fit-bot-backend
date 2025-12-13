import express from "express";
import { ConversationSessionController } from "../../controllers/Chat";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: ConversationSession
   *   description: ConversationSession management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /conversation-sessions/get:
   *   get:
   *     summary: Fetch a ConversationSession
   *     tags: [ConversationSession]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/get",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.findOne
  );

  /**
   * @swagger
   * /conversation-sessions/{id}:
   *   get:
   *     summary: Fetch ConversationSession by ID
   *     tags: [ConversationSession]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ConversationSession ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: ConversationSession Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.findById
  );

  /**
   * @swagger
   * /conversation-sessions:
   *   get:
   *     summary: Fetch ConversationSessions
   *     tags: [ConversationSession]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.findMany
  );

  /**
   * @swagger
   * /conversation-sessions:
   *   post:
   *     summary: Create ConversationSession
   *     tags: [ConversationSession]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.create
  );

  /**
   * @swagger
   * /conversation-sessions:
   *   put:
   *     summary: Update ConversationSession
   *     tags: [ConversationSession]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.update
  );

  /**
   * @swagger
   * /conversation-sessions/restore:
   *   put:
   *     summary: Restore ConversationSession
   *     tags: [ConversationSession]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: ConversationSession Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.restore
  );

  /**
   * @swagger
   * /conversation-sessions:
   *   delete:
   *     summary: Delete ConversationSession
   *     tags: [ConversationSession]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: ConversationSession Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ConversationSessionController.delete
  );

  return router;
};

export default routes;
