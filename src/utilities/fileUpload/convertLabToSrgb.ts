import { Response, NextFunction } from "express";
import sharp from "sharp";
import fs from "fs";

const convertLabToSrgb = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  const filePath = req.file.path;

  try {
    const metadata = await sharp(filePath).metadata();

    // Only convert if not sRGB
    if (metadata.space !== "srgb") {
      const tempPath = filePath + ".tmp";
      await sharp(filePath).toColorspace("srgb").toFile(tempPath);
      fs.renameSync(tempPath, filePath);
    }

    next();
  } catch (err) {
    next(err);
  }
};

export { convertLabToSrgb };
