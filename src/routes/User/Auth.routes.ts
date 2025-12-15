import express from "express";
import { UserController } from "../../controllers/User";
import { AuthenticateUser } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Auth APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: User Login
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   */
  router.post("/telegram-login", UserController.login);

  /**
   * @swagger
   * /auth:
   *   get:
   *     summary: Get Token User
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Token
   */
  router.get("/", AuthenticateUser, UserController.getMe);

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register New User
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone_number:
   *                 type: string
   *               password:
   *                 type: string
   *               code:
   *                 type: string
   *               role:
   *                 type: string
   *             required:
   *               - first_name
   *               - last_name
   *               - email
   *               - phone_number
   *               - password
   *     responses:
   *       201:
   *         description: User Created
   *       400:
   *         description: Validation Error
   */
  router.post("/telegram-register", UserController.register);

  return router;
};

export default routes;
