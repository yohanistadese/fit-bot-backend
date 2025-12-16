import express from "express";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { OrderController } from "../../controllers/Product";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Order
   *   description: Order management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /orders/get:
   *   get:
   *     summary: Fetch an Order
   *     tags: [Order]
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
    OrderController.findOne
  );

  /**
   * @swagger
   * /orders/{id}:
   *   get:
   *     summary: Fetch Order by ID
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Order Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderController.findById
  );

  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Fetch all Orders
   *     tags: [Order]
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    OrderController.findMany
  );

  /**
   * @swagger
   * /orders:
   *   post:
   *     summary: Create Order
   *     tags: [Order]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    OrderController.create
  );

  /**
   * @swagger
   * /orders:
   *   put:
   *     summary: Update Order
   *     tags: [Order]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    OrderController.update
  );

  /**
   * @swagger
   * /orders/restore:
   *   patch:
   *     summary: Restore Order
   *     tags: [Order]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Order Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    OrderController.restore
  );

  /**
   * @swagger
   * /orders:
   *   delete:
   *     summary: Delete Order
   *     tags: [Order]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Order Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    OrderController.delete
  );

  return router;
};

export default routes;
