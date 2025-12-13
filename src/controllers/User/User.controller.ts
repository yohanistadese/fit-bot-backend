import { Response } from "express";
import Joi from "joi";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import UserService from "../../services/User/User.service";
import { UserDAL } from "../../dals/User";
import { EmailRegex } from "../../utilities/constants/Constants";
import { User } from "../../models/User";

const UserModelName = "User";

class UserController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query);
    UserService.findMany(request.user, parsedQuery.query, parsedQuery.paranoid)
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

  static findOne(request: any, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query);
    UserService.findOne(request.user, parsedQuery.query, parsedQuery.paranoid)
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

    if (!error) {
      const id = request.params.id;
      const parsedQuery: any = ParseQuery(request.query);
      UserService.findById(
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
              `${UserModelName} Not Found`,
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
      email: Joi.string()
        .pattern(new RegExp(EmailRegex))
        .message("Invalid Email Address"),
      name: Joi.string().required(),
      telegram_user_id: Joi.string(),
      telegram_user_name: Joi.string(),
      role: Joi.string(),
      status: Joi.string(),
      is_subscriber: Joi.boolean(),
      stripe_customer_id: Joi.string(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data = request.body;
      UserService.create(request.user, data)
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
      email: Joi.string()
        .pattern(new RegExp(EmailRegex))
        .message("Invalid Email Address"),
      name: Joi.string(),
      telegram_user_id: Joi.string(),
      telegram_user_name: Joi.string(),
      role: Joi.string(),
      status: Joi.string(),
      is_subscriber: Joi.boolean(),
      stripe_customer_id: Joi.string(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const id = request.body.id;
      const data = request.body;
      UserService.update(request.user, id, data)
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

  static updateMe(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      name: Joi.string().trim().max(50),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      const user: User = request.user;
      UserService.update(user, user.id, data)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
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
      const id = request.body.id;
      const force = request.body.force ?? false;
      UserService.delete(request.user, id, null, force)
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
      const id = request.body.id;
      UserService.restore(request.user, id)
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

  static checkEmail(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      email: Joi.string()
        .pattern(new RegExp(EmailRegex))
        .message("Invalid Email Address")
        .required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      let email: string = request.body.email.toLowerCase();
      UserDAL.findOne({
        where: { email },
      })
        .then((result) => {
          if (result) {
            ServerResponse(
              request,
              response,
              200,
              { exists: true },
              "This Email is already exists",
              startTime
            );
          } else {
            ServerResponse(
              request,
              response,
              200,
              { exists: false },
              "This Email is does not exist",
              startTime
            );
          }
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode || 500,
            error.payload || { message: "Internal Server Error" },
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
      return;
    }
  }
}

export default UserController;
