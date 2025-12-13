import express from "express";
import { PlanItemController } from "../../controllers/Fitness";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: PlanItem
   *   description: PlanItem management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /plan-items/get:
   *   get:
   *     summary: Fetch a PlanItem
   *     tags: [PlanItem]
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
    PlanItemController.findOne
  );

  /**
   * @swagger
   * /plan-items/{id}:
   *   get:
   *     summary: Fetch PlanItem by ID
   *     tags: [PlanItem]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: PlanItem ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: PlanItem Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanItemController.findById
  );

  /**
   * @swagger
   * /plan-items:
   *   get:
   *     summary: Fetch PlanItems
   *     tags: [PlanItem]
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
    PlanItemController.findMany
  );

  /**
   * @swagger
   * /plan-items:
   *   post:
   *     summary: Create PlanItem
   *     tags: [PlanItem]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanItemController.create
  );

  /**
   * @swagger
   * /plan-items:
   *   put:
   *     summary: Update PlanItem
   *     tags: [PlanItem]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanItemController.update
  );

  /**
   * @swagger
   * /plan-items/restore:
   *   patch:
   *     summary: Restore PlanItem
   *     tags: [PlanItem]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: PlanItem Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    PlanItemController.restore
  );

  /**
   * @swagger
   * /plan-items:
   *   delete:
   *     summary: Delete PlanItem
   *     tags: [PlanItem]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: PlanItem Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PlanItemController.delete
  );

  return router;
};

export default routes;
