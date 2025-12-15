import express from "express";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { CartController } from "../../controllers/Product";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Cart
   *   description: Cart management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /cart/get:
   *   get:
   *     summary: Fetch a Cart
   *     tags: [Cart]
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
    CartController.findOne
  );

  /**
   * @swagger
   * /cart/{id}:
   *   get:
   *     summary: Fetch Cart by ID
   *     tags: [Cart]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Cart ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Cart Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartController.findById
  );

  /**
   * @swagger
   * /cart:
   *   get:
   *     summary: Fetch all Carts
   *     tags: [Cart]
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    CartController.findMany
  );

  /**
   * @swagger
   * /cart:
   *   post:
   *     summary: Create Cart
   *     tags: [Cart]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartController.create
  );

  /**
   * @swagger
   * /cart:
   *   put:
   *     summary: Update Cart
   *     tags: [Cart]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartController.update
  );

  /**
   * @swagger
   * /cart/restore:
   *   patch:
   *     summary: Restore Cart
   *     tags: [Cart]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Cart Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartController.restore
  );

  /**
   * @swagger
   * /cart:
   *   delete:
   *     summary: Delete Cart
   *     tags: [Cart]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Cart Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartController.delete
  );

  return router;
};

export default routes;
