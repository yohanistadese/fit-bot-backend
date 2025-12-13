import multer from "multer";
import path from "path";
import { UploadConstants } from "../../config";

const profile_upload = multer({
  fileFilter: (req: any, file: any, callback: Function) => {
    if (UploadConstants.MimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error("Invalid image type, Only PNG and JPEG images are allowed.")
      );
    }
  },
  limits: {
    fileSize: UploadConstants.MAX_SIZE,
  },
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: Function) => {
      cb(null, "profiles/");
    },
    filename: (req: any, file: any, cb: Function) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
});

const file_upload = multer({
  fileFilter: (_req, file, cb) => {
    if (UploadConstants.MimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err: any = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
      err.message = `Invalid file type. Only PNG and JPEG images are allowed.`;
      cb(err);
    }
  },
  limits: {
    fileSize: UploadConstants.MAX_SIZE,
  },
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: Function) => {
      cb(null, "uploads/");
    },
    filename: (req: any, file: any, cb: Function) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
});

export { profile_upload, file_upload };
