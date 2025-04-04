import fs from "fs";
import path from "path";
import UploadLocation from "../config/UploadLocation";
import { ImageTypes } from "../enums/Image/ImageTypes";

class ImageService {
  async getImage(fileId: string, imageType: ImageTypes): Promise<string> {
    const uploadLocation = UploadLocation.getGlobalUploadFolder();

    const typeToFolder: Record<ImageTypes, string> = {
      [ImageTypes.PROFILE]: UploadLocation.getProfileFolder(),
      [ImageTypes.BOOK]: UploadLocation.getBookFolder(),
    };

    const baseFolder = typeToFolder[imageType];
    const searchDir = path.join(uploadLocation, baseFolder);

    try {
      await fs.promises.access(searchDir);
    } catch {
      throw new Error("O diretório de upload não existe");
    }

    const baseFileName = fileId.toLowerCase();

    const foundFilePath = await this.findFileRecursively(
      searchDir,
      baseFileName
    );

    if (!foundFilePath) {
      throw new Error("O arquivo não existe");
    }

    return foundFilePath;
  }

  private async findFileRecursively(
    directory: string,
    fileId: string
  ): Promise<string | null> {
    const items = await fs.promises.readdir(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stats = await fs.promises.stat(fullPath);

      if (stats.isDirectory()) {
        const found = await this.findFileRecursively(fullPath, fileId);
        if (found) return found;
      } else {
        if (item.toLowerCase() === fileId.toLowerCase()) {
          return fullPath;
        }
      }
    }

    return null;
  }
}

export default new ImageService();
