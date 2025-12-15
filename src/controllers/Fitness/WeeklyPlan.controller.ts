import { Response } from "express";
import Joi from "joi";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import {
  ExerciseService,
  MealService,
  PlanDayService,
  PlanItemService,
  WeeklyPlanService,
  WorkLogService,
} from "../../services/Fitness";
import { UserDAL } from "../../dals/User";
import { WeeklyPlanDAL } from "../../dals/Fitness";
import { GeneratedBy } from "../../utilities/constants/Constants";

const ModelName = "WorkLog";

class WorkLogController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    WorkLogService.findMany(
      request.user,
      parsedQuery.query,
      parsedQuery.paranoid
    )
      .then((result) =>
        ServerResponse(request, response, 200, result, "", startTime)
      )
      .catch((err) =>
        ServerResponse(
          request,
          response,
          err.statusCode,
          err.payload,
          "Error",
          startTime
        )
      );
  }

  static findOne(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    WorkLogService.findOne(
      request.user,
      parsedQuery.query,
      parsedQuery.paranoid
    )
      .then((result) =>
        ServerResponse(request, response, 200, result, "", startTime)
      )
      .catch((err) =>
        ServerResponse(
          request,
          response,
          err.statusCode,
          err.payload,
          "Error",
          startTime
        )
      );
  }

  static findById(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({ id: Joi.string().guid().required() });
    const { error } = schema.validate(request.params);

    if (!error) {
      const id = request.params.id;
      const parsedQuery: any = ParseQuery(request.query);
      WorkLogService.findById(
        request.user,
        id,
        parsedQuery.query,
        parsedQuery.paranoid
      )
        .then((result) => {
          if (result)
            ServerResponse(request, response, 200, result, "", startTime);
          else
            ServerResponse(
              request,
              response,
              404,
              null,
              `${ModelName} Not Found`,
              startTime
            );
        })
        .catch((err) =>
          ServerResponse(
            request,
            response,
            err.statusCode,
            err.payload,
            "Error",
            startTime
          )
        );
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static create(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      user_id: Joi.string().guid().required(),
      plan_item_id: Joi.string().guid().allow(null),
      exercise_id: Joi.string().guid().required(),
      performed_at: Joi.date().required(),
      actual_sets: Joi.object().allow(null),
      actual_reps: Joi.object().allow(null),
      actual_weight: Joi.number().allow(null),
      rpe: Joi.number().allow(null),
      notes: Joi.string().allow(null, ""),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      WorkLogService.create(request.user, request.body)
        .then((result) =>
          ServerResponse(request, response, 201, result, "Success", startTime)
        )
        .catch((err) =>
          ServerResponse(
            request,
            response,
            err.statusCode,
            err.payload,
            "Error",
            startTime
          )
        );
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static update(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      user_id: Joi.string().guid().allow(null),
      plan_item_id: Joi.string().guid().allow(null),
      exercise_id: Joi.string().guid().allow(null),
      performed_at: Joi.date().allow(null),
      actual_sets: Joi.object().allow(null),
      actual_reps: Joi.object().allow(null),
      actual_weight: Joi.number().allow(null),
      rpe: Joi.number().allow(null),
      notes: Joi.string().allow(null, ""),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id, ...data } = request.body;
      WorkLogService.update(request.user, id, data)
        .then((result) =>
          ServerResponse(request, response, 200, result, "Success", startTime)
        )
        .catch((err) =>
          ServerResponse(
            request,
            response,
            err.statusCode,
            err.payload,
            "Error",
            startTime
          )
        );
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static delete(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      force: Joi.boolean(),
    });
    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id, force } = request.body;
      WorkLogService.delete(request.user, id, null, force ?? false)
        .then((result) =>
          ServerResponse(request, response, 200, result, "Success", startTime)
        )
        .catch((err) =>
          ServerResponse(
            request,
            response,
            err.statusCode,
            err.payload,
            "Error",
            startTime
          )
        );
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static restore(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({ id: Joi.string().guid().required() });
    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id } = request.body;
      WorkLogService.restore(request.user, id)
        .then((result) =>
          ServerResponse(request, response, 200, result, "Success", startTime)
        )
        .catch((err) =>
          ServerResponse(
            request,
            response,
            err.statusCode,
            err.payload,
            "Error",
            startTime
          )
        );
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static async createWeeklyPlan(request: any, response: Response) {
    const startTime = new Date();

    const schema = Joi.object({
      user_id: Joi.string().guid().required(),
    });

    const { error, value } = schema.validate(request.params, {
      abortEarly: false,
    });
    if (error) {
      return ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }

    const { user_id } = value;
    const { exercises = [], meals = [] } = request.body;

    try {
      const user = await UserDAL.findById(user_id);
      if (!user)
        return ServerResponse(
          request,
          response,
          404,
          null,
          "User not found",
          startTime
        );

      const lastWeek = await WeeklyPlanDAL.findOne({
        where: { user_id },
        order: [["week_number", "DESC"]],
      });
      const weekNumber = lastWeek ? lastWeek.week_number + 1 : 1;

      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      console.log("Creating Weekly Plan ...");
      const weeklyPlan = await WeeklyPlanService.create(user, {
        user_id,
        start_date: startDate,
        end_date: endDate,
        week_number: weekNumber,
        generated_by: GeneratedBy.AGENT,
      } as any);

      const exerciseData = exercises.map((ex: any) => ({
        name: ex.name,
        slug: ex.slug,
        gif_url: ex.gif_url,
        primary_muscle_group: ex.primary_muscle_group,
        secondary_muscle_groups: ex.secondary_muscle_groups,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        metadata: ex.metadata ?? {},
        user_id,
      }));

      const mealData = meals.map((meal: any) => ({
        name: meal.name,
        description: meal.description,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        tags: meal.tags,
        metadata: meal.metadata ?? {},
        user_id,
      }));

      console.log("Creating Workout Exercise ...");
      const exerciseResult = await ExerciseService.bulkCreate(user, {
        exercises: exerciseData,
      });

      console.log("Creating Meal Plan ...");
      const mealResult = await MealService.bulkCreate(user, {
        meals: mealData,
      });

      // Prepare plan items
      const planItems: any[] = [];
      let orderIndex = 1;

      exerciseResult.rows.forEach((exercise: any) => {
        planItems.push({
          weekly_plan_id: weeklyPlan.id,
          exercise_id: exercise.id,
          user_id,
          type: "exercise",
          title: exercise.name,
          description: "",
          order_index: orderIndex++,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: exercise.rest,
          metadata: {},
        });
      });

      mealResult.rows.forEach((meal: any) => {
        planItems.push({
          weekly_plan_id: weeklyPlan.id,
          meal_id: meal.id,
          user_id,
          type: "meal",
          title: meal.name,
          description: meal.description,
          order_index: orderIndex++,
          metadata: {},
        });
      });

      console.log("Creating Plan Items...");
      await PlanItemService.bulkCreate(user, { planItems });

      console.log("Process Done ...");
      return ServerResponse(
        request,
        response,
        201,
        { weeklyPlan, exercises: exerciseResult.rows, meals: mealResult.rows },
        "Weekly plan created",
        startTime
      );
    } catch (err: any) {
      return ServerResponse(
        request,
        response,
        err.statusCode || 500,
        err.payload || { message: err.message },
        "Error",
        startTime
      );
    }
  }
}

export default WorkLogController;
