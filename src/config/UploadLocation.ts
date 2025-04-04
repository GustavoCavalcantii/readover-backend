import dotenv from "dotenv";

dotenv.config();

class UploadLocation {
  getGlobalUploadFolder(): string {
    return process.env.UPLOAD_LOCATION ?? process.cwd();
  }

  getProfileFolder(): string {
    return process.env.USER_IMAGE_UPLOAD_FOLDER || "uploads/images/users";
  }

  getBookFolder(): string {
    return process.env.BOOK_IMAGE_UPLOAD_FOLDER || "uploads/images/books";
  }
}

export default new UploadLocation();
