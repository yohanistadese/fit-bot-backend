import { Response } from "express";
import Joi from "joi";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import { PlanDayService } from "../../services/Fitness";

const ModelName = "PlanDay";

class PlanDayController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    PlanDayService.findMany(
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
    PlanDayService.findOne(
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
      PlanDayService.findById(
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
      weekly_plan_id: Joi.string().guid().required(),
      user_id: Joi.string().guid().required(),
      date: Joi.date().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      PlanDayService.create(request.user, request.body)
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
      weekly_plan_id: Joi.string().guid().allow(null),
      user_id: Joi.string().guid().allow(null),
      date: Joi.date().allow(null),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id, ...data } = request.body;
      PlanDayService.update(request.user, id, data)
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
      PlanDayService.delete(request.user, id, null, force ?? false)
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
      PlanDayService.restore(request.user, id)
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

export default PlanDayController;
