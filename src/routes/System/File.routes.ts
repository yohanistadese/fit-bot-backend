import express from "express";
import { FileController } from "../../controllers/System";
import { AuthenticateUser, AuthorizeAccess } from "../../middleware/Auth/Auth";
import { file_upload } from "../../utilities/fileUpload/upload";
import {
  uploadProfileImage,
  uploadSingleFile,
} from "../../utilities/fileUpload/fileUploadHandler";

const routes = () => {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: File
   *   description: File management APIs
   */

  /**
   * @swagger
   * /files/upload-url:
   *   post:
   *     summary: Upload a file from a URL
   *     tags: [File]
   *     responses:
   *       201: Created
   *       400: Bad Request
   *       500: Server Error
   */
  router.post("/upload-url", AuthenticateUser, FileController.uploadFromUrl);

  /**
   * @swagger
   * /files/get:
   *   get:
   *     summary: Fetch a file
   *     tags: [File]
   *     responses:
   *       200: Success
   *       404: Not Found
   */
  router.get("/get", AuthenticateUser, FileController.findOne);

  /**
   * @swagger
   * /files/{id}:
   *   get:
   *     summary: Fetch file by ID
   *     tags: [File]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: File ID
   *     responses:
   *       200: Success
   *       404: Not Found
   */
  router.get("/:id", AuthenticateUser, FileController.findById);

  /**
   * @swagger
   * /files:
   *   get:
   *     summary: Fetch multiple files
   *     tags: [File]
   *     responses:
   *       200: Success
   */
  router.get("/", AuthenticateUser, FileController.findMany);

  /**
   * @swagger
   * /files/single:
   *   post:
   *     summary: Create a single file
   *     tags: [File]
   *     responses:
   *       201: Created
   */
  router.post(
    "/single",
    AuthenticateUser,
    uploadSingleFile,
    FileController.create
  );

  /**
   * @swagger
   * /files/profile-upload:
   *   post:
   *     summary: Upload profile image
   *     tags: [File]
   *     responses:
   *       201: Created
   */
  router.post(
    "/profile-upload",
    AuthenticateUser,
    uploadProfileImage,
    FileController.createProfile
  );

  /**
   * @swagger
   * /files/path:
   *   post:
   *     summary: Create a file with a specific path
   *     tags: [File]
   *     responses:
   *       201: Created
   */
  router.post(
    "/path",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    FileController.create_with_path
  );

  /**
   * @swagger
   * /files/multiple:
   *   post:
   *     summary: Create multiple files
   *     tags: [File]
   *     responses:
   *       201: Created
   */
  router.post(
    "/multiple",
    file_upload.array("files"),
    AuthenticateUser,
    FileController.createBulk
  );

  /**
   * @swagger
   * /files:
   *   put:
   *     summary: Update a file
   *     tags: [File]
   *     responses:
   *       200: Updated
   */
  router.put("/", AuthenticateUser, FileController.update);

  /**
   * @swagger
   * /files/restore:
   *   patch:
   *     summary: Restore a deleted file
   *     tags: [File]
   *     responses:
   *       200: Success
   *       404: Not Found
   */
  router.put(
    "/restore",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    FileController.restore
  );

  /**
   * @swagger
   * /files:
   *   delete:
   *     summary: Delete a file
   *     tags: [File]
   *     responses:
   *       200: Deleted
   *       404: Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    AuthorizeAccess(["system", "admin"]),
    FileController.delete
  );

  return router;
};

export default routes;
