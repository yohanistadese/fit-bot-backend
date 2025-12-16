import express from "express";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { OrderItemController } from "../../controllers/Product";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: OrderItem
   *   description: OrderItem management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /order-items/get:
   *   get:
   *     summary: Fetch an OrderItem
   *     tags: [OrderItem]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: Query filter
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/get",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderItemController.findOne
  );

  /**
   * @swagger
   * /order-items/{id}:
   *   get:
   *     summary: Fetch OrderItem by ID
   *     tags: [OrderItem]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: OrderItem ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: OrderItem Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderItemController.findById
  );

  /**
   * @swagger
   * /order-items:
   *   get:
   *     summary: Fetch all OrderItems
   *     tags: [OrderItem]
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    OrderItemController.findMany
  );

  /**
   * @swagger
   * /order-items:
   *   post:
   *     summary: Create OrderItem
   *     tags: [OrderItem]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderItemController.create
  );

  /**
   * @swagger
   * /order-items:
   *   put:
   *     summary: Update OrderItem
   *     tags: [OrderItem]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderItemController.update
  );

  /**
   * @swagger
   * /order-items/restore:
   *   patch:
   *     summary: Restore OrderItem
   *     tags: [OrderItem]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: OrderItem Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderItemController.restore
  );

  /**
   * @swagger
   * /order-items:
   *   delete:
   *     summary: Delete OrderItem
   *     tags: [OrderItem]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: OrderItem Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderItemController.delete
  );

  return router;
};

export default routes;
