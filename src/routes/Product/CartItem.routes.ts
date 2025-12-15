import express from "express";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { CartItemController } from "../../controllers/Product";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: CartItem
   *   description: CartItem management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /cart-items/get:
   *   get:
   *     summary: Fetch a CartItem
   *     tags: [CartItem]
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
    CartItemController.findOne
  );

  /**
   * @swagger
   * /cart-items/{id}:
   *   get:
   *     summary: Fetch CartItem by ID
   *     tags: [CartItem]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: CartItem ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: CartItem Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartItemController.findById
  );

  /**
   * @swagger
   * /cart-items:
   *   get:
   *     summary: Fetch all CartItems
   *     tags: [CartItem]
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartItemController.findMany
  );

  /**
   * @swagger
   * /cart-items:
   *   post:
   *     summary: Create CartItem
   *     tags: [CartItem]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartItemController.create
  );

  /**
   * @swagger
   * /cart-items:
   *   put:
   *     summary: Update CartItem
   *     tags: [CartItem]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartItemController.update
  );

  /**
   * @swagger
   * /cart-items/restore:
   *   patch:
   *     summary: Restore CartItem
   *     tags: [CartItem]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: CartItem Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartItemController.restore
  );

  /**
   * @swagger
   * /cart-items:
   *   delete:
   *     summary: Delete CartItem
   *     tags: [CartItem]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: CartItem Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    CartItemController.delete
  );

  return router;
};

export default routes;
