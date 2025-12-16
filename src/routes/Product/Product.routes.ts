import express from "express";
import { ProductController } from "../../controllers/Product";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Product
   *   description: Product management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /products/get:
   *   get:
   *     summary: Fetch a Product
   *     tags: [Product]
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
    ProductController.findOne
  );

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Fetch Product by ID
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Product Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    ProductController.findById
  );

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Fetch all Products
   *     tags: [Product]
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    ProductController.findMany
  );

  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create Product
   *     tags: [Product]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ProductController.create
  );

  /**
   * @swagger
   * /products:
   *   put:
   *     summary: Update Product
   *     tags: [Product]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ProductController.update
  );

  /**
   * @swagger
   * /products/restore:
   *   patch:
   *     summary: Restore Product
   *     tags: [Product]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Product Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ProductController.restore
  );

  /**
   * @swagger
   * /products:
   *   delete:
   *     summary: Delete Product
   *     tags: [Product]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Product Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ProductController.delete
  );

  return router;
};

export default routes;
