import multer from "multer";
import path from "path";

import { config } from "dotenv";
import { IUser } from "../interfaces/IUser";
import { ensureExists } from "../utils/DirectoryUtils";

config();

import { v4 as uuidv4 } from "uuid";
import UploadLocation from "./UploadLocation";
import { MulterRequest } from "../@types/MulterRequest";

const imageProfileUpload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, callback) => {
      const loggedInUser = req.user as IUser;

      if (!loggedInUser) {
        return callback(new Error("Usuário não autenticado"), "");
      }

      const userFolder = loggedInUser.username
        .trim()
        .replace(/[\/\.\-\\]/g, "")
        .toLowerCase();

      const uploadPath = path.join(
        UploadLocation.getGlobalUploadFolder(),
        UploadLocation.getProfileFolder(),
        userFolder,
        "profile"
      );

      await ensureExists(uploadPath);

      callback(null, uploadPath);
    },
    filename: (req: MulterRequest, file, callback) => {
      const loggedInUser = req.user as IUser;

      if (!loggedInUser) {
        return callback(new Error("Usuário não autenticado"), "");
      }

      const ext = file.originalname.split(".").pop();
      const uniqueId = uuidv4();
      const safeFilename = `${uniqueId}.${ext}`;

      req.newFilename = safeFilename;

      callback(null, safeFilename);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedMimes.includes(file.mimetype)) {
      return callback(
        new Error("Tipo de arquivo não permitido. Envie um PNG ou JPG.")
      );
    }

    callback(null, true);
  },
});

export default imageProfileUpload;
