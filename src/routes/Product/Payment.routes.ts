import express from "express";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { PaymentController } from "../../controllers/Product";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Payment
   *   description: Payment management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /payments/get:
   *   get:
   *     summary: Fetch a Payment
   *     tags: [Payment]
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
    PaymentController.findOne
  );

  /**
   * @swagger
   * /payments/{id}:
   *   get:
   *     summary: Fetch Payment by ID
   *     tags: [Payment]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Payment ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Payment Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PaymentController.findById
  );

  /**
   * @swagger
   * /payments:
   *   get:
   *     summary: Fetch all Payments
   *     tags: [Payment]
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PaymentController.findMany
  );

  /**
   * @swagger
   * /payments:
   *   post:
   *     summary: Create Payment
   *     tags: [Payment]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    PaymentController.create
  );

  /**
   * @swagger
   * /payments:
   *   put:
   *     summary: Update Payment
   *     tags: [Payment]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    PaymentController.update
  );

  /**
   * @swagger
   * /payments/restore:
   *   patch:
   *     summary: Restore Payment
   *     tags: [Payment]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Payment Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    PaymentController.restore
  );

  /**
   * @swagger
   * /payments:
   *   delete:
   *     summary: Delete Payment
   *     tags: [Payment]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Payment Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    PaymentController.delete
  );

  return router;
};

export default routes;
