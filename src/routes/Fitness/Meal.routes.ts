import express from "express";
import { MealController } from "../../controllers/Fitness";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Meal
   *   description: Meal management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /meals/get:
   *   get:
   *     summary: Fetch a Meal
   *     tags: [Meal]
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
    MealController.findOne
  );

  /**
   * @swagger
   * /meals/{id}:
   *   get:
   *     summary: Fetch Meal by ID
   *     tags: [Meal]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Meal ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: Meal Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    MealController.findById
  );

  /**
   * @swagger
   * /meals:
   *   get:
   *     summary: Fetch Meals
   *     tags: [Meal]
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
    MealController.findMany
  );

  /**
   * @swagger
   * /meals:
   *   post:
   *     summary: Create Meal
   *     tags: [Meal]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    MealController.create
  );

  /**
   * @swagger
   * /meals:
   *   put:
   *     summary: Update Meal
   *     tags: [Meal]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin", "user"]),
    MealController.update
  );

  /**
   * @swagger
   * /meals/restore:
   *   patch:
   *     summary: Restore Meal
   *     tags: [Meal]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Meal Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    MealController.restore
  );

  /**
   * @swagger
   * /meals:
   *   delete:
   *     summary: Delete Meal
   *     tags: [Meal]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Meal Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    MealController.delete
  );

  return router;
};

export default routes;
