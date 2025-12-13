import express from "express";
import PlanDayController from "../../controllers/Fitness/PlanDay.controller";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: PlanDay
   *   description: PlanDay management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /plan-days/get:
   *   get:
   *     summary: Fetch a PlanDay
   *     tags: [PlanDay]
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
    PlanDayController.findOne
  );

  /**
   * @swagger
   * /plan-days/{id}:
   *   get:
   *     summary: Fetch PlanDay by ID
   *     tags: [PlanDay]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: PlanDay ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: PlanDay Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanDayController.findById
  );

  /**
   * @swagger
   * /plan-days:
   *   get:
   *     summary: Fetch PlanDays
   *     tags: [PlanDay]
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
    PlanDayController.findMany
  );

  /**
   * @swagger
   * /plan-days:
   *   post:
   *     summary: Create PlanDay
   *     tags: [PlanDay]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanDayController.create
  );

  /**
   * @swagger
   * /plan-days:
   *   put:
   *     summary: Update PlanDay
   *     tags: [PlanDay]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanDayController.update
  );

  /**
   * @swagger
   * /plan-days/restore:
   *   patch:
   *     summary: Restore PlanDay
   *     tags: [PlanDay]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: PlanDay Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system"]),
    PlanDayController.restore
  );

  /**
   * @swagger
   * /plan-days:
   *   delete:
   *     summary: Delete PlanDay
   *     tags: [PlanDay]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: PlanDay Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanDayController.delete
  );

  return router;
};

export default routes;
