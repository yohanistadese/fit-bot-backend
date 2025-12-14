import { Response } from "express";
import { SubscriptionPlanService } from "../../services/Subscription";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import Joi from "joi";
import { User } from "../../models/User";

const ModelName = "SubscriptionPlan";

class SubscriptionPlanController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsed = ParseQuery(request.query);

    SubscriptionPlanService.findMany(
      request.user,
      parsed.query,
      parsed.paranoid
    )
      .then((result) =>
        ServerResponse(request, response, 200, result, "", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }

  static findById(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({ id: Joi.string().guid().required() });
    const { error } = schema.validate(request.params);

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

    const id = request.params.id;
    const parsed = ParseQuery(request.query);

    SubscriptionPlanService.findById(
      request.user,
      id,
      parsed.query,
      parsed.paranoid
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
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }

  static findOne(request: any, response: Response) {
    const startTime = new Date();
    const parsed = ParseQuery(request.query);

    SubscriptionPlanService.findOne(request.user, parsed.query, parsed.paranoid)
      .then((result) =>
        ServerResponse(request, response, 200, result, "", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }

  static create(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      currency: Joi.string().required(),
      amenities: Joi.array().items(Joi.string()).optional(),
      description: Joi.string().optional(),
    });

    const { error, value } = schema.validate(request.body, {
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

    const user: User = request.user;

    SubscriptionPlanService.create(user, value)
      .then((result) =>
        ServerResponse(request, response, 201, result, "Success", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }

  static update(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      name: Joi.string().optional(),
      price: Joi.number().optional(),
      currency: Joi.string().optional(),
      amenities: Joi.array().items(Joi.string()).optional(),
      description: Joi.string().optional(),
    });

    const { error, value } = schema.validate(request.body, {
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

    const id = request.body.id;
    const user: User = request.user;

    SubscriptionPlanService.update(user, id, value)
      .then((result) =>
        ServerResponse(request, response, 200, result, "Success", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }

  static delete(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      force: Joi.boolean().optional(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });
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

    const id = request.body.id;
    const force = request.body.force ?? false;
    const user: User = request.user;

    SubscriptionPlanService.delete(user, id, null, force)
      .then((result) =>
        ServerResponse(request, response, 200, result, "Success", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }

  static restore(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({ id: Joi.string().guid().required() });

    const { error } = schema.validate(request.body, { abortEarly: false });
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

    const id = request.body.id;
    const user: User = request.user;

    SubscriptionPlanService.restore(user, id)
      .then((result) =>
        ServerResponse(request, response, 200, result, "Success", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        )
      );
  }
}

export default SubscriptionPlanController;
