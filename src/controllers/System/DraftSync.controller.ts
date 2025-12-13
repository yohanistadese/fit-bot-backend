import { Response } from "express";
import { DraftSyncService } from "../../services/System";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import Joi from "joi";
import { DraftSyncStatus, DraftSyncType } from "../../models/System/DraftSync";

const ModelName = "DraftSync";

class DraftSyncController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);

    DraftSyncService.findMany(
      request.user,
      parsedQuery.query,
      parsedQuery.paranoid
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

  static findOne(request: any, response: Response) {
    const startTime = new Date();
    const parsedQuery: any = ParseQuery(request.query);
    DraftSyncService.findOne(
      request.user,
      parsedQuery.query,
      parsedQuery.paranoid
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

  static findMyDraftSync(request: any, response: Response) {
    const startTime = new Date();

    const userId: string = request?.user?.id;
    const parsedQuery: any = ParseQuery(request.query);

    DraftSyncService.findMany(
      request.user,
      {
        ...parsedQuery.options,
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
      },
      parsedQuery.paranoid
    )
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

  static findById(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
    });
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
    const parsedQuery: any = ParseQuery(request.query);
    DraftSyncService.findById(
      request.user,
      id,
      parsedQuery.query,
      parsedQuery.paranoid
    )
      .then((result) => {
        if (result) {
          ServerResponse(request, response, 200, result, "", startTime);
        } else {
          ServerResponse(
            request,
            response,
            404,
            null,
            `${ModelName} Not Found`,
            startTime
          );
        }
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

  static create(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      type: Joi.string()
        .valid(...Object.values(DraftSyncType))
        .default(DraftSyncType.INVESTMENT),
      payload: Joi.object(),
      last_section: Joi.string().optional().allow(null).default(null),
      status: Joi.string()
        .valid(...Object.values(DraftSyncStatus))
        .default(DraftSyncStatus.ACTIVE),
      expires_at: Joi.date().optional().allow(null).default(null),
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

    DraftSyncService.create(request.user, request.body)
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
      type: Joi.string().valid(...Object.values(DraftSyncType)),
      payload: Joi.object(),
      last_section: Joi.string().optional().allow(null),
      status: Joi.string().valid(...Object.values(DraftSyncStatus)),
      expires_at: Joi.date().optional().allow(null),
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

    const { id, ...data } = request.body;
    DraftSyncService.update(request.user, id, data)
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
      force: Joi.boolean(),
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

    const { id, force = false } = request.body;
    DraftSyncService.delete(request.user, id, null, force)
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

    DraftSyncService.restore(request.user, request.body.id)
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

  static bulkDelete(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      ids: Joi.array().items(Joi.string().guid()).min(1).required(),
      force: Joi.boolean(),
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

    const { ids, force = false } = request.body;
    DraftSyncService.bulkDelete(request.user, ids, null, force)
      .then((result) =>
        ServerResponse(request, response, 200, result, "Success", startTime)
      )
      .catch((error) =>
        ServerResponse(
          request,
          response,
          error.statusCode || 500,
          error.payload || error.message,
          "Error",
          startTime
        )
      );
  }
}

export default DraftSyncController;
