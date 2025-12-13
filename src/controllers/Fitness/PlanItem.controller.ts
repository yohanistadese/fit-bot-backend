import { Response } from "express";
import Joi from "joi";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import { PlanItemService } from "../../services/Fitness";

const ModelName = "PlanItem";

class PlanItemController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    PlanItemService.findMany(
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
    PlanItemService.findOne(
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
      PlanItemService.findById(
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
      meal_id: Joi.string().guid().required(),
      plan_day_id: Joi.string().guid().required(),
      exercise_id: Joi.string().guid().required(),
      user_id: Joi.string().guid().required(),
      type: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().allow(null, ""),
      scheduled_time: Joi.string().allow(null, ""),
      order_index: Joi.number().allow(null),
      is_overridden: Joi.boolean().allow(null),
      metadata: Joi.object().allow(null),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      PlanItemService.create(request.user, request.body)
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
      meal_id: Joi.string().guid().allow(null),
      plan_day_id: Joi.string().guid().allow(null),
      exercise_id: Joi.string().guid().allow(null),
      user_id: Joi.string().guid().allow(null),
      type: Joi.string().allow(null, ""),
      title: Joi.string().allow(null, ""),
      description: Joi.string().allow(null, ""),
      scheduled_time: Joi.string().allow(null, ""),
      order_index: Joi.number().allow(null),
      is_overridden: Joi.boolean().allow(null),
      metadata: Joi.object().allow(null),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id, ...data } = request.body;
      PlanItemService.update(request.user, id, data)
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
      PlanItemService.delete(request.user, id, null, force ?? false)
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
      PlanItemService.restore(request.user, id)
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

export default PlanItemController;
