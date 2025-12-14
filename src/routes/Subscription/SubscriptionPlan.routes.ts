import express from "express";
import { SubscriptionPlanController } from "../../controllers/Subscription";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: SubscriptionPlan
   *   description: Subscription Plan management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /subscription-plans/get:
   *   get:
   *     summary: Fetch a Subscription Plan
   *     tags: [SubscriptionPlan]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: Query filters
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/get",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionPlanController.findOne
  );

  /**
   * @swagger
   * /subscription-plans/{id}:
   *   get:
   *     summary: Fetch Subscription Plan by ID
   *     tags: [SubscriptionPlan]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Subscription Plan ID
   *       - in: query
   *         name: query
   *         description: Query filters
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input validation error
   *       404:
   *         description: Subscription Plan not found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionPlanController.findById
  );

  /**
   * @swagger
   * /subscription-plans:
   *   get:
   *     summary: Fetch Subscription Plans
   *     tags: [SubscriptionPlan]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: Query filters
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    SubscriptionPlanController.findMany
  );

  /**
   * @swagger
   * /subscription-plans:
   *   post:
   *     summary: Create a Subscription Plan
   *     tags: [SubscriptionPlan]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionPlanController.create
  );

  /**
   * @swagger
   * /subscription-plans:
   *   put:
   *     summary: Update a Subscription Plan
   *     tags: [SubscriptionPlan]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionPlanController.update
  );

  /**
   * @swagger
   * /subscription-plans/restore:
   *   patch:
   *     summary: Restore a Subscription Plan
   *     tags: [SubscriptionPlan]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Subscription Plan not found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionPlanController.restore
  );

  /**
   * @swagger
   * /subscription-plans:
   *   delete:
   *     summary: Delete a Subscription Plan
   *     tags: [SubscriptionPlan]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Subscription Plan not found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    SubscriptionPlanController.delete
  );

  return router;
};

export default routes;
