import { Response } from "express";
import Joi from "joi";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import { MealService } from "../../services/Fitness";

const ModelName = "Meal";

class MealController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    MealService.findMany(request.user, parsedQuery.query, parsedQuery.paranoid)
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
    MealService.findOne(request.user, parsedQuery.query, parsedQuery.paranoid)
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
      MealService.findById(
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
      name: Joi.string().required(),
      description: Joi.string().allow(null, ""),
      calories: Joi.number().allow(null),
      protein: Joi.number().allow(null),
      carbs: Joi.number().allow(null),
      fats: Joi.number().allow(null),
      tags: Joi.object().allow(null),
      metadata: Joi.object().allow(null),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      MealService.create(request.user, request.body)
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
      name: Joi.string().allow(null, ""),
      description: Joi.string().allow(null, ""),
      calories: Joi.number().allow(null),
      protein: Joi.number().allow(null),
      carbs: Joi.number().allow(null),
      fats: Joi.number().allow(null),
      tags: Joi.object().allow(null),
      metadata: Joi.object().allow(null),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id, ...data } = request.body;
      MealService.update(request.user, id, data)
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
      MealService.delete(request.user, id, null, force ?? false)
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
      MealService.restore(request.user, id)
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
}

export default MealController;
