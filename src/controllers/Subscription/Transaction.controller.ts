import { Response } from "express";
import { TransactionService } from "../../services/Subscription";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import Joi from "joi";
import { User } from "../../models/User";
import {
  TransactionStatus,
  PayementMethod,
} from "../../utilities/constants/Constants";

const ModelName = "Transaction";

class TransactionController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsed = ParseQuery(request.query);

    TransactionService.findMany(request.user, parsed.query, parsed.paranoid)
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

    TransactionService.findById(request.user, id, parsed.query, parsed.paranoid)
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

    TransactionService.findOne(request.user, parsed.query, parsed.paranoid)
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
      subscription_id: Joi.string().guid().required(),
      amount: Joi.number().required(),
      payment_method: Joi.string()
        .valid(...Object.values(PayementMethod))
        .default(PayementMethod.STRIPE),
      status: Joi.string()
        .valid(...Object.values(TransactionStatus))
        .default(TransactionStatus.PENDING),
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

    TransactionService.create(user, value)
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
      subscription_id: Joi.string().guid().optional(),
      amount: Joi.number().optional(),
      payment_method: Joi.string()
        .valid(...Object.values(PayementMethod))
        .optional(),
      status: Joi.string()
        .valid(...Object.values(TransactionStatus))
        .optional(),
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

    TransactionService.update(user, id, value)
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

    const { error } = schema.validate(request.body, {
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
    const force = request.body.force ?? false;
    const user: User = request.user;

    TransactionService.delete(user, id, null, force)
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

    const { error } = schema.validate(request.body, {
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

    TransactionService.restore(user, id)
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

export default TransactionController;
