import express from "express";
import { ChatTuneController } from "../../controllers/Chat";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: ChatTune
   *   description: ChatTune management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /chat-tunes/get:
   *   get:
   *     summary: Fetch a ChatTune
   *     tags: [ChatTune]
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
    ChatTuneController.findOne
  );

  /**
   * @swagger
   * /chat-tunes/{id}:
   *   get:
   *     summary: Fetch ChatTune by ID
   *     tags: [ChatTune]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ChatTune ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: ChatTune Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ChatTuneController.findById
  );

  /**
   * @swagger
   * /chat-tunes:
   *   get:
   *     summary: Fetch ChatTunes
   *     tags: [ChatTune]
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
    ChatTuneController.findMany
  );

  /**
   * @swagger
   * /chat-tunes:
   *   post:
   *     summary: Create ChatTune
   *     tags: [ChatTune]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ChatTuneController.create
  );

  /**
   * @swagger
   * /chat-tunes:
   *   put:
   *     summary: Update ChatTune
   *     tags: [ChatTune]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ChatTuneController.update
  );

  /**
   * @swagger
   * /chat-tunes/restore:
   *   put:
   *     summary: Restore ChatTune
   *     tags: [ChatTune]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: ChatTune Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ChatTuneController.restore
  );

  /**
   * @swagger
   * /chat-tunes:
   *   delete:
   *     summary: Delete ChatTune
   *     tags: [ChatTune]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: ChatTune Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ChatTuneController.delete
  );

  return router;
};

export default routes;
