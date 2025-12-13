import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import multer from "multer";
import fs from "fs";
import ServerResponse from "../../utilities/response/Response";
import { file_upload, profile_upload } from "./upload";
import { UploadConstants } from "../../config";

const handleUpload =
  (uploadHandler: any) =>
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      uploadHandler(req, res, async (err: any) => {
        const startTime = new Date();

        console.log("Uploaded file:", req.file);

        if (err) {
          // Multer errors
          if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
              // Log large file attempt
              return ServerResponse(
                req,
                res,
                400,
                null,
                `File too large. Maximum allowed size is ${
                  UploadConstants.MAX_SIZE / (1024 * 1024)
                } MB.`,
                startTime
              );
            }
            return ServerResponse(req, res, 400, null, err.message, startTime);
          }

          // Network/server error
          return ServerResponse(
            req,
            res,
            500,
            null,
            "Upload could not be completed due to a server error. Please try again shortly.",
            startTime
          );
        }

        if (!req.file) {
          return ServerResponse(
            req,
            res,
            400,
            null,
            "No file uploaded.",
            startTime
          );
        }

        let metadata;
        try {
          metadata = await sharp(req.file.path).metadata();
        } catch {
          return ServerResponse(
            req,
            res,
            400,
            null,
            "Invalid or corrupted image file.",
            startTime
          );
        }

        if (!metadata.width || !metadata.height) {
          return ServerResponse(
            req,
            res,
            400,
            null,
            "Invalid or corrupted image file.",
            startTime
          );
        }

        //  Resize if image exceeds max dimensions
        if (
          metadata.width > UploadConstants.MAX_DIMENSIONS.width ||
          metadata.height > UploadConstants.MAX_DIMENSIONS.height
        ) {
          const tempPath = req.file.path + ".tmp";

          await sharp(req.file.path)
            .resize({
              width: UploadConstants.MAX_DIMENSIONS.width,
              height: UploadConstants.MAX_DIMENSIONS.height,
              fit: "inside",
            })
            .toFile(tempPath);

          fs.renameSync(tempPath, req.file.path);
        }

        next();
      });
    } catch (error) {
      // Catch unexpected server errors
      const startTime = new Date();
      return ServerResponse(
        req,
        res,
        500,
        null,
        "Upload could not be completed due to a server error. Please try again shortly.",
        startTime
      );
    }
  };

// Lightweight handler for profile image uploads
export const handleProfileUpload =
  (uploadHandler: any) =>
  (req: any, res: Response, next: NextFunction): void => {
    const startTime = new Date();

    uploadHandler(req, res, async (err: any) => {
      if (err) {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_FILE_SIZE"
        ) {
          return ServerResponse(
            req,
            res,
            400,
            null,
            `File too large. Maximum allowed size is ${
              UploadConstants.MAX_SIZE / (1024 * 1024)
            } MB.`,
            startTime
          );
        }
        return ServerResponse(req, res, 400, null, err.message, startTime);
      }

      if (!req.file) {
        return ServerResponse(
          req,
          res,
          400,
          null,
          "No file uploaded.",
          startTime
        );
      }

      try {
        const metadata = await sharp(req.file.path).metadata();

        if (!metadata.width || !metadata.height) {
          return ServerResponse(
            req,
            res,
            400,
            null,
            "Invalid or corrupted image file.",
            startTime
          );
        }

        next();
      } catch {
        return ServerResponse(
          req,
          res,
          400,
          null,
          "Invalid or corrupted image file.",
          startTime
        );
      }
    });
  };

export const uploadSingleFile = handleUpload(file_upload.single("file"));
export const uploadProfileImage = handleProfileUpload(
  profile_upload.single("file")
);
