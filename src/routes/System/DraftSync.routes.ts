import express from "express";
import { DraftSyncController } from "../../controllers/System";
import { AuthenticateUser } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: DraftSync
   *   description: DraftSync management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /draft-sync/get:
   *   get:
   *     summary: Fetch a DraftSync
   *     tags: [DraftSync]
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
    // AuthenticateUser,
    // AuthorizeAccess(["read_draftsync"]),
    DraftSyncController.findOne
  );

  /**
   * @swagger
   * /draft-sync/my:
   *   get:
   *     summary: Fetch DraftSyncs for the logged-in user
   *     tags: [DraftSync]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: Optional query parameters for filtering
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: DraftSync Not Found
   */
  router.get("/my", AuthenticateUser, DraftSyncController.findMyDraftSync);

  /**
   * @swagger
   * /draft-sync/{id}:
   *   get:
   *     summary: Fetch DraftSync by ID
   *     tags: [DraftSync]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: DraftSync ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: DraftSync Not Found
   */
  router.get(
    "/:id",
    // AuthenticateUser,
    // AuthorizeAccess(["read_draftsync"]),
    DraftSyncController.findById
  );

  /**
   * @swagger
   * /draft-sync:
   *   get:
   *     summary: Fetch DraftSyncs
   *     tags: [DraftSync]
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
    // AuthenticateUser,
    // AuthorizeAccess(["read_draftsync"]),
    DraftSyncController.findMany
  );

  /**
   * @swagger
   * /draft-sync:
   *   post:
   *     summary: Create DraftSync
   *     tags: [DraftSync]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post("/", AuthenticateUser, DraftSyncController.create);

  /**
   * @swagger
   * /draft-sync:
   *   put:
   *     summary: Update DraftSync
   *     tags: [DraftSync]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put("/", AuthenticateUser, DraftSyncController.update);

  /**
   * @swagger
   * /draft-sync/restore:
   *   patch:
   *     summary: Restore DraftSync
   *     tags: [DraftSync]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: DraftSync Not Found
   */
  router.patch("/restore", AuthenticateUser, DraftSyncController.restore);

  /**
   * @swagger
   * /draft-sync:
   *   delete:
   *     summary: Delete DraftSync
   *     tags: [DraftSync]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: DraftSync Not Found
   */
  router.delete("/", AuthenticateUser, DraftSyncController.delete);

  /**
   * @swagger
   * /draft-sync/bulk-delete:
   *   delete:
   *     summary: Bulk Delete DraftSyncs
   *     tags: [DraftSync]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ids:
   *                 type: array
   *                 items:
   *                   type: string
   *               force:
   *                 type: boolean
   *             required:
   *               - ids
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   */
  router.delete(
    "/bulk-delete",
    AuthenticateUser,
    DraftSyncController.bulkDelete
  );

  return router;
};

export default routes;
