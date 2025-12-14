import express from "express";
import { ExerciseController } from "../../controllers/Fitness";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Exercise
   *   description: Exercise management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /exercises/get:
   *   get:
   *     summary: Fetch an Exercise
   *     tags: [Exercise]
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
    AuthorizeAccess(["system", "admin", "user"]),
    ExerciseController.findOne
  );

  /**
   * @swagger
   * /exercises/{id}:
   *   get:
   *     summary: Fetch Exercise by ID
   *     tags: [Exercise]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Exercise ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: Exercise Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    ExerciseController.findById
  );

  /**
   * @swagger
   * /exercises:
   *   get:
   *     summary: Fetch Exercises
   *     tags: [Exercise]
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
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    ExerciseController.findMany
  );

  /**
   * @swagger
   * /exercises:
   *   post:
   *     summary: Create Exercise
   *     tags: [Exercise]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    ExerciseController.create
  );

  /**
   * @swagger
   * /exercises:
   *   put:
   *     summary: Update Exercise
   *     tags: [Exercise]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    ExerciseController.update
  );

  /**
   * @swagger
   * /exercises/restore:
   *   patch:
   *     summary: Restore Exercise
   *     tags: [Exercise]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Exercise Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ExerciseController.restore
  );

  /**
   * @swagger
   * /exercises:
   *   delete:
   *     summary: Delete Exercise
   *     tags: [Exercise]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Exercise Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    ExerciseController.delete
  );

  return router;
};

export default routes;
