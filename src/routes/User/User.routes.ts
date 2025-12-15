import express from "express";
import { UserController } from "../../controllers/User";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { WeeklyPlanController } from "../../controllers/Fitness";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /users/get:
   *   get:
   *     summary: Fetch a User
   *     tags: [User]
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
    AuthorizeAccess(["system", "admin"]),
    UserController.findOne
  );

  /**
   * @swagger
   * /users/{user_id}/plans:
   *   post:
   *     summary: Create weekly plan
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       201:
   *         description: Created
   */
  router.post("/:user_id/plans", WeeklyPlanController.createWeeklyPlan);

  /**
   * @swagger
   * /users/check-email:
   *   post:
   *     summary: Check if email is already registered
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Email check result
   */
  router.post("/check-email", UserController.checkEmail);

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Fetch User by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: User Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserController.findById
  );

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Fetch Users
   *     tags: [User]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   */
  router.get("/", AuthenticateUser, UserController.findMany);

  /**
   * @swagger
   * /users/create:
   *   post:
   *     summary: Create User
   *     tags: [User]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    // AuthenticateUser,
    // AuthorizeAccess(["system", "admin"]),
    UserController.create
  );

  /**
   * @swagger
   * /users:
   *   put:
   *     summary: Update User
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserController.update
  );

  /**
   * @swagger
   * /users/me:
   *   put:
   *     summary: Update User (self)
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put("/me", AuthenticateUser, UserController.updateMe);

  /**
   * @swagger
   * /users/restore:
   *   patch:
   *     summary: Restore User
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: User Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserController.restore
  );

  /**
   * @swagger
   * /users:
   *   delete:
   *     summary: Delete User
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: User Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    UserController.delete
  );

  return router;
};

export default routes;
