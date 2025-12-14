import express from "express";
import { SubscriptionController } from "../../controllers/Subscription";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Subscription
   *   description: Subscription management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /subscriptions/get:
   *   get:
   *     summary: Fetch a Subscription
   *     tags: [Subscription]
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
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionController.findOne
  );

  /**
   * @swagger
   * /subscriptions/{id}:
   *   get:
   *     summary: Fetch Subscription by ID
   *     tags: [Subscription]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Subscription ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: Subscription Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionController.findById
  );

  /**
   * @swagger
   * /subscriptions:
   *   get:
   *     summary: Fetch Subscriptions
   *     tags: [Subscription]
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
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionController.findMany
  );

  /**
   * @swagger
   * /subscriptions:
   *   post:
   *     summary: Create Subscription
   *     tags: [Subscription]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionController.create
  );

  /**
   * @swagger
   * /subscriptions:
   *   put:
   *     summary: Update Subscription
   *     tags: [Subscription]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionController.update
  );

  /**
   * @swagger
   * /subscriptions/restore:
   *   patch:
   *     summary: Restore Subscription
   *     tags: [Subscription]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Subscription Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionController.restore
  );

  /**
   * @swagger
   * /subscriptions:
   *   delete:
   *     summary: Delete Subscription
   *     tags: [Subscription]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Subscription Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionController.delete
  );

  return router;
};

export default routes;
