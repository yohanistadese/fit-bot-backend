import express from "express";
import { WorkLogController } from "../../controllers/Fitness";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: WorkLog
   *   description: WorkLog management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /work-logs/get:
   *   get:
   *     summary: Fetch a WorkLog
   *     tags: [WorkLog]
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
    WorkLogController.findOne
  );

  /**
   * @swagger
   * /work-logs/{id}:
   *   get:
   *     summary: Fetch WorkLog by ID
   *     tags: [WorkLog]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: WorkLog ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: WorkLog Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    WorkLogController.findById
  );

  /**
   * @swagger
   * /work-logs:
   *   get:
   *     summary: Fetch WorkLogs
   *     tags: [WorkLog]
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
    WorkLogController.findMany
  );

  /**
   * @swagger
   * /work-logs:
   *   post:
   *     summary: Create WorkLog
   *     tags: [WorkLog]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    WorkLogController.create
  );

  /**
   * @swagger
   * /work-logs:
   *   put:
   *     summary: Update WorkLog
   *     tags: [WorkLog]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    WorkLogController.update
  );

  /**
   * @swagger
   * /work-logs/restore:
   *   patch:
   *     summary: Restore WorkLog
   *     tags: [WorkLog]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: WorkLog Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    WorkLogController.restore
  );

  /**
   * @swagger
   * /work-logs:
   *   delete:
   *     summary: Delete WorkLog
   *     tags: [WorkLog]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: WorkLog Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    WorkLogController.delete
  );

  return router;
};

export default routes;
