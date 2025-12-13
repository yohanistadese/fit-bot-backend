import { Response } from "express";
import Joi from "joi";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import UserProfileService from "../../services/User/UserProfile.service";

const ModelName = "UserProfile";

class UserProfileController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    UserProfileService.findMany(
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
    UserProfileService.findOne(
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
      UserProfileService.findById(
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
      goals: Joi.string().allow(null, ""),
      injuries: Joi.string().allow(null, ""),
      experience_level: Joi.string().allow(null, ""),
      available_equipment: Joi.string().allow(null, ""),
      training_days_per_week: Joi.number().allow(null),
      diet_preference: Joi.string().allow(null, ""),
      dietary_restrictions: Joi.string().allow(null, ""),
      other_preferences: Joi.string().allow(null, ""),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      UserProfileService.create(request.user, request.body)
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
      goals: Joi.string().allow(null, ""),
      injuries: Joi.string().allow(null, ""),
      experience_level: Joi.string().allow(null, ""),
      available_equipment: Joi.string().allow(null, ""),
      training_days_per_week: Joi.number().allow(null),
      diet_preference: Joi.string().allow(null, ""),
      dietary_restrictions: Joi.string().allow(null, ""),
      other_preferences: Joi.string().allow(null, ""),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const { id, ...data } = request.body;
      UserProfileService.update(request.user, id, data)
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
      UserProfileService.delete(request.user, id, null, force ?? false)
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
      UserProfileService.restore(request.user, id)
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

export default UserProfileController;
