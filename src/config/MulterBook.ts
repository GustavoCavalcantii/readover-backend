import multer from "multer";
import path from "path";

import { config } from "dotenv";
import { ensureExists } from "../utils/DirectoryUtils";

import { v4 as uuidv4 } from "uuid";
import UploadLocation from "./UploadLocation";

config();

const imageBookUpload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, callback) => {
      const bookGenre = "action"; // TODO: Consultar no banco o genero

      const uploadPath = path.join(
        UploadLocation.getGlobalUploadFolder(),
        UploadLocation.getBookFolder(),
        bookGenre
      );

      await ensureExists(uploadPath);

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const bookId = "chaveUnica"; // TODO: Consultar no banco uma chave única

      const ext = file.originalname.split(".").pop();
      const uniqueId = uuidv4();
      const safeFilename = `${uniqueId}.${ext}`;

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

export default imageBookUpload;
