import { Response } from "express";
import { SubscriptionService } from "../../services/Subscription";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import Joi from "joi";
import { User } from "../../models/User";
import { SubscriptionStatus } from "../../utilities/constants/Constants";

const ModelName = "Subscription";

class SubscriptionController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsed = ParseQuery(request.query);

    SubscriptionService.findMany(request.user, parsed.query, parsed.paranoid)
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

    SubscriptionService.findById(
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

    SubscriptionService.findOne(request.user, parsed.query, parsed.paranoid)
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
      user_id: Joi.string().guid().required(),
      subscription_plan_id: Joi.string().guid().required(),
      stripe_payment_intent_id: Joi.string().optional(),
      stripe_checkout_session_id: Joi.string().optional(),
      stripe_customer_id: Joi.string().optional(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      status: Joi.string()
        .valid(...Object.values(SubscriptionStatus))
        .default(SubscriptionStatus.PENDING),
      metadata: Joi.object().optional(),
    });

    const { error: validationError, value } = schema.validate(request.body, {
      abortEarly: false,
    });
    if (validationError) {
      return ServerResponse(
        request,
        response,
        400,
        { details: validationError.details },
        "Input validation error",
        startTime
      );
    }

    const user: User = request.user;

    SubscriptionService.create(user, value)
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
      user_id: Joi.string().guid().optional(),
      subscription_plan_id: Joi.string().guid().optional(),
      stripe_payment_intent_id: Joi.string().optional(),
      stripe_checkout_session_id: Joi.string().optional(),
      stripe_customer_id: Joi.string().optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      status: Joi.string()
        .valid(...Object.values(SubscriptionStatus))
        .optional(),
      metadata: Joi.object().optional(),
    });

    const { error: validationError, value } = schema.validate(request.body, {
      abortEarly: false,
    });
    if (validationError) {
      return ServerResponse(
        request,
        response,
        400,
        { details: validationError.details },
        "Input validation error",
        startTime
      );
    }

    const id = request.body.id;
    const user: User = request.user;

    SubscriptionService.update(user, id, value)
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

    const { error: validationError } = schema.validate(request.body, {
      abortEarly: false,
    });
    if (validationError) {
      return ServerResponse(
        request,
        response,
        400,
        { details: validationError.details },
        "Input validation error",
        startTime
      );
    }

    const id = request.body.id;
    const force = request.body.force ?? false;
    const user: User = request.user;

    SubscriptionService.delete(user, id, null, force)
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

    const { error: validationError } = schema.validate(request.body, {
      abortEarly: false,
    });
    if (validationError) {
      return ServerResponse(
        request,
        response,
        400,
        { details: validationError.details },
        "Input validation error",
        startTime
      );
    }

    const id = request.body.id;
    const user: User = request.user;

    SubscriptionService.restore(user, id)
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

export default SubscriptionController;
