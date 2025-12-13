import { Request, Response } from "express";
import { FileService } from "../../services/System";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import Joi from "joi";
import { User } from "../../models/User";
import axios from "axios";
import path from "path";
import fs from "fs";
import fsAsync from "fs/promises";
import sharp from "sharp";

const ModelName = "File";

class FileController {
  static findMany(request: Request, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query);

    FileService.findMany(parsedQuery.query, parsedQuery.paranoid)
      .then((result) => {
        ServerResponse(request, response, 200, result, "", startTime);
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
  }

  static findOne(request: Request, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query, ["F", "I", "O", "P"]);

    FileService.findOne(parsedQuery.query, parsedQuery.paranoid)
      .then((result) => {
        ServerResponse(request, response, 200, result, "", startTime);
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
  }

  static findById(request: Request, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
    });

    const { error } = schema.validate(request.params);

    if (!error) {
      let id: string = request.params.id;
      let parsedQuery: any = ParseQuery(request.query, ["I", "P"]);
      FileService.findById(id, parsedQuery.query, parsedQuery.paranoid)
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
      return;
    }
  }

  static async create(request: any, response: Response): Promise<void> {
    const startTime = new Date();
    const _file = request.file;

    if (!_file) {
      ServerResponse(
        request,
        response,
        400,
        null,
        "No file uploaded.",
        startTime
      );
      return;
    }

    try {
      const user: User = request.user;

      const meta = await sharp(_file.path).metadata();

      const fileData = {
        name: _file.originalname,
        type: _file.mimetype,
        size: _file.size,
        path: _file.path,
        width: meta.width || null,
        height: meta.height || null,
      };

      const result = await FileService.create(user, fileData as any);

      ServerResponse(request, response, 201, result, "Success", startTime);
    } catch (error: any) {
      ServerResponse(
        request,
        response,
        error?.statusCode || 500,
        error?.payload || "Failed to process the file.",
        "Error",
        startTime
      );
    }
  }

  static async createProfile(request: any, response: Response): Promise<void> {
    const startTime = new Date();
    const _file = request.file;

    if (!_file) {
      ServerResponse(
        request,
        response,
        400,
        null,
        "No file uploaded.",
        startTime
      );
      return;
    }

    try {
      const user: User = request.user as any;

      const meta = await sharp(_file.path).metadata();

      const profile_file = {
        name: _file.originalname,
        type: _file.mimetype,
        size: _file.size,
        path: _file.path,
        width: meta.width || null,
        height: meta.height || null,
      };

      const savedFile = await FileService.create(user, profile_file as any);

      ServerResponse(
        request,
        response,
        201,
        savedFile,
        "Profile uploaded successfully.",
        startTime
      );
    } catch (error: any) {
      ServerResponse(
        request,
        response,
        error?.statusCode || 500,
        error?.payload || "Failed to process the file.",
        "Error",
        startTime
      );
    }
  }

  static async uploadFromUrl(request: any, response: Response): Promise<any> {
    const startTime = new Date();
    const { file_urls } = request.body;

    if (!file_urls || !Array.isArray(file_urls)) {
      return ServerResponse(
        request,
        response,
        400,
        null,
        "File URLs array is required.",
        startTime
      );
    }

    try {
      const user: User = request.user;

      const uploadedFiles = await Promise.all(
        file_urls.map(async (file_url: string) => {
          try {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const fileName = `file-${unique}.png`;
            const tempPath = `uploads/${fileName}`;

            const writer = fs.createWriteStream(tempPath);
            const { data } = await axios({
              method: "GET",
              url: file_url,
              responseType: "stream",
            });
            data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });

            const meta = await sharp(tempPath).metadata();

            const saved = await FileService.create(user, {
              name: path.basename(tempPath),
              type: "image/png",
              size: (await fsAsync.stat(tempPath)).size,
              path: tempPath,
              width: meta.width || null,
              height: meta.height || null,
            } as any);

            return {
              id: saved.id,
              name: saved.name,
              type: saved.type,
              size: saved.size,
              path: saved.path.replace(/\\/g, "/"),
              updatedAt: saved.updatedAt,
              createdAt: saved.createdAt,
              deletedAt: saved.deletedAt,
            };
          } catch (error) {
            console.error(`Error processing file ${file_url}:`, error);
            return null;
          }
        })
      );

      const success = uploadedFiles.filter((x) => x !== null);

      ServerResponse(request, response, 201, success, "Success", startTime);
      return success;
    } catch (error: any) {
      ServerResponse(
        request,
        response,
        500,
        null,
        "Error processing file upload.",
        startTime
      );
      return null;
    }
  }
  static async create_with_path(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      name: Joi.string().required(),
      type: Joi.string().required(),
      size: Joi.number().required(),
      path: Joi.string().required(),
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

    try {
      const user: User = request.user;
      const meta = await sharp(request.body.path).metadata();

      const file: any = {
        name: request.body.name,
        type: request.body.type,
        size: request.body.size,
        path: request.body.path,
        width: meta.width || null,
        height: meta.height || null,
      };

      const result = await FileService.create(user, file);
      ServerResponse(request, response, 201, result, "Success", startTime);
    } catch (err: any) {
      ServerResponse(
        request,
        response,
        err.statusCode || 500,
        err.payload || "Error",
        "Error",
        startTime
      );
    }
  }

  static async createBulk(request: any, response: Response) {
    const startTime = new Date();
    const files = (request.files ?? []).map((file: any) => ({
      name: file?.originalname,
      type: file?.mimetype,
      size: file?.size,
      path: file?.path,
    }));

    if (!files.length) {
      return ServerResponse(
        request,
        response,
        400,
        null,
        "No files uploaded.",
        startTime
      );
    }

    try {
      const user: User = request.user;

      // Add width and height metadata
      const filesWithMeta = await Promise.all(
        files.map(async (file: any) => {
          const meta = await sharp(file.path).metadata();
          return {
            ...file,
            width: meta.width || null,
            height: meta.height || null,
          };
        })
      );

      const result = await FileService.createBulk(user, filesWithMeta);
      ServerResponse(request, response, 201, result, "Success", startTime);
    } catch (err: any) {
      ServerResponse(
        request,
        response,
        err.statusCode || 500,
        err.payload || "Error",
        "Error",
        startTime
      );
    }
  }

  static async update(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      name: Joi.string(),
      value: Joi.string(),
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

    try {
      const user: User = request.user;
      const result = await FileService.update(
        user,
        request.body.id,
        request.body
      );
      ServerResponse(request, response, 200, result, "Success", startTime);
    } catch (err: any) {
      ServerResponse(
        request,
        response,
        err.statusCode || 500,
        err.payload || "Error",
        "Error",
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
      const id: string = request.body.id;
      const force: boolean = request.body.force ?? false;
      const user: User = request.user;
      FileService.delete(user, id, null, force)
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

  static restore(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const id: string = request.body.id;
      const user: User = request.user;
      FileService.restore(user, id)
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

  static getUncheckedImage(request: Request, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query, ["F", "I", "O", "P"]);

    FileService.getOneUncheckedImage(parsedQuery.query, parsedQuery.paranoid)
      .then((result) => {
        ServerResponse(request, response, 200, result, "", startTime);
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
  }

  static updateImageCheckedStatus(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      image_checked: Joi.boolean().required(),
      has_text: Joi.boolean().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const id: string = request.body.id;
      const data: any = request.body;
      const user: User = request.user;

      FileService.updateImageCheckedStatus(user, id, data)
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
}

export default FileController;
