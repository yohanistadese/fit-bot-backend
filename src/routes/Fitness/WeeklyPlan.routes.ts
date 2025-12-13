import express from "express";
import { WeeklyPlanController } from "../../controllers/Fitness";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: WeeklyPlan
   *   description: WeeklyPlan management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /weekly-plans/get:
   *   get:
   *     summary: Fetch a WeeklyPlan
   *     tags: [WeeklyPlan]
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
    WeeklyPlanController.findOne
  );

  /**
   * @swagger
   * /weekly-plans/{id}:
   *   get:
   *     summary: Fetch WeeklyPlan by ID
   *     tags: [WeeklyPlan]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: WeeklyPlan ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: WeeklyPlan Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    WeeklyPlanController.findById
  );

  /**
   * @swagger
   * /weekly-plans:
   *   get:
   *     summary: Fetch WeeklyPlans
   *     tags: [WeeklyPlan]
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
    WeeklyPlanController.findMany
  );

  /**
   * @swagger
   * /weekly-plans:
   *   post:
   *     summary: Create WeeklyPlan
   *     tags: [WeeklyPlan]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    WeeklyPlanController.create
  );

  /**
   * @swagger
   * /weekly-plans:
   *   put:
   *     summary: Update WeeklyPlan
   *     tags: [WeeklyPlan]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    WeeklyPlanController.update
  );

  /**
   * @swagger
   * /weekly-plans/restore:
   *   patch:
   *     summary: Restore WeeklyPlan
   *     tags: [WeeklyPlan]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: WeeklyPlan Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    WeeklyPlanController.restore
  );

  /**
   * @swagger
   * /weekly-plans:
   *   delete:
   *     summary: Delete WeeklyPlan
   *     tags: [WeeklyPlan]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: WeeklyPlan Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    WeeklyPlanController.delete
  );

  return router;
};

export default routes;
