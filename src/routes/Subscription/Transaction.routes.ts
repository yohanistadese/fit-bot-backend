import express from "express";
import { TransactionController } from "../../controllers/Subscription";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Transaction
   *   description: Transaction management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /transactions/get:
   *   get:
   *     summary: Fetch a Transaction
   *     tags: [Transaction]
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
    TransactionController.findOne
  );

  /**
   * @swagger
   * /transactions/{id}:
   *   get:
   *     summary: Fetch Transaction by ID
   *     tags: [Transaction]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Transaction ID
   *       - in: query
   *         name: query
   *         description: Query filters
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input validation error
   *       404:
   *         description: Transaction not found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    TransactionController.findById
  );

  /**
   * @swagger
   * /transactions:
   *   get:
   *     summary: Fetch Transactions
   *     tags: [Transaction]
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
    TransactionController.findMany
  );

  /**
   * @swagger
   * /transactions:
   *   post:
   *     summary: Create a Transaction
   *     tags: [Transaction]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    TransactionController.create
  );

  /**
   * @swagger
   * /transactions:
   *   put:
   *     summary: Update a Transaction
   *     tags: [Transaction]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    TransactionController.update
  );

  /**
   * @swagger
   * /transactions/restore:
   *   patch:
   *     summary: Restore a Transaction
   *     tags: [Transaction]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Transaction not found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    TransactionController.restore
  );

  /**
   * @swagger
   * /transactions:
   *   delete:
   *     summary: Delete a Transaction
   *     tags: [Transaction]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Transaction not found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    TransactionController.delete
  );

  return router;
};

export default routes;
