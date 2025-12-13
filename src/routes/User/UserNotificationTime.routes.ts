import express from "express";
import { UserNotificationTimeController } from "../../controllers/User";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: UserNotificationTime
   *   description: UserNotificationTime management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /UserNotificationTimes/get:
   *   get:
   *     summary: Fetch a UserNotificationTime
   *     tags: [UserNotificationTime]
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
    UserNotificationTimeController.findOne
  );

  /**
   * @swagger
   * /UserNotificationTimes/{id}:
   *   get:
   *     summary: Fetch UserNotificationTime by ID
   *     tags: [UserNotificationTime]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: UserNotificationTime ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: UserNotificationTime Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserNotificationTimeController.findById
  );

  /**
   * @swagger
   * /UserNotificationTimes:
   *   get:
   *     summary: Fetch all UserNotificationTimes
   *     tags: [UserNotificationTime]
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
    UserNotificationTimeController.findMany
  );

  /**
   * @swagger
   * /UserNotificationTimes:
   *   post:
   *     summary: Create UserNotificationTime
   *     tags: [UserNotificationTime]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserNotificationTimeController.create
  );

  /**
   * @swagger
   * /UserNotificationTimes:
   *   put:
   *     summary: Update UserNotificationTime
   *     tags: [UserNotificationTime]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserNotificationTimeController.update
  );

  /**
   * @swagger
   * /UserNotificationTimes/restore:
   *   patch:
   *     summary: Restore UserNotificationTime
   *     tags: [UserNotificationTime]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: UserNotificationTime Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserNotificationTimeController.restore
  );

  /**
   * @swagger
   * /UserNotificationTimes:
   *   delete:
   *     summary: Delete UserNotificationTime
   *     tags: [UserNotificationTime]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: UserNotificationTime Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserNotificationTimeController.delete
  );

  return router;
};

export default routes;
